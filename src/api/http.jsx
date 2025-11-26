import axios from 'axios';

import { storageService } from '../services/storage';
import { authApi } from './authApi';

export const API_URL = 'https://fundelio.duckdns.org/api/v1';

export const http = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  withCredentials: true,
});

let refreshTokenPromise = null;

let logoutCallback;
export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

const performTokenRefresh = async () => {
  try {
    console.log('Refreshing token...');
    const response = await authApi.refreshToken();
    const newAccessToken = response?.data?.data?.accessToken;

    if (newAccessToken) {
      console.log('Refresh token success');
      storageService.setAccessToken(newAccessToken);
      return newAccessToken;
    } else {
      throw new Error('Cannot get access token from refresh API');
    }
  } catch (error) {
    console.error('Refresh token failed:', error);
    storageService.removeAccessToken();

    if (refreshTokenIntervalId) {
      clearInterval(refreshTokenIntervalId);
      refreshTokenIntervalId = null;
    }

    if (logoutCallback) {
      logoutCallback();
    }

    throw error;
  }
};

class Http {
  constructor() {
    this._instance = http;
    this.setupInterceptors();
  }

  setupInterceptors() {
    this._instance.interceptors.request.use(
      (config) => {
        if (config.requireToken) {
          const token = storageService.getAccessToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this._instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          const errorData = error.response.data;
          let shouldRefresh = false;

          if (errorData?.errors && Array.isArray(errorData.errors)) {
            shouldRefresh = errorData.errors.some(
              (err) => err.code === 1005
            );
          } else if (errorData?.code === 1005) {
            shouldRefresh = true;
          }

          if (shouldRefresh) {
            if (!refreshTokenPromise) {
              refreshTokenPromise = authApi
                .refreshToken()
                .then((response) => {
                  const newAccessToken = response?.data?.data?.accessToken;
                  if (newAccessToken) {
                    storageService.setAccessToken(newAccessToken);
                    return newAccessToken;
                  }
                  return Promise.reject(
                    'Cannot get access token from refresh API'
                  );
                })
                .catch((refreshError) => {
                  storageService.removeAccessToken();
                  if (logoutCallback) {
                    logoutCallback();
                  }
                  return Promise.reject(refreshError);
                })
                .finally(() => {
                  refreshTokenPromise = null;
                });
            }

            return refreshTokenPromise.then((accessToken) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return this._instance(originalRequest);
            });
          }
        }

        return Promise.reject(error.response?.data || error);
      }
    );
  }

  get instance() {
    return this._instance;
  }
}

export const httpService = new Http().instance;
