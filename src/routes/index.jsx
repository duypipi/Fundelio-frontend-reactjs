import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import HomePage from '../pages/HomePage';
import CreateCampaignPage from '../pages/CreateCampaignPage';
import CampaignDetailPage from '../pages/CampaignDetailPage';
import LandingPage from '@/pages/LandingPage';

/**
 * Application routes configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    
    children: [
      { index: true, element: <LandingPage /> },

      { path: 'home', element: <HomePage /> },

      {
        path: 'campaigns',
        children: [
          { path: 'detail', element: <CampaignDetailPage /> },
        ],
      },
      // {
      //   path: 'auth',
      //   children: [
      //     { path: 'login', element: <LoginPage /> },
      //     { path: 'register', element: <RegisterPage /> },
      //   ],
      // }
    ],
  },
  // CreateCampaignPage has its own layout (CreateCampaignHeader + Footer)
  {
    path: '/campaigns/create',
    element: <CreateCampaignPage />,
  },
]);