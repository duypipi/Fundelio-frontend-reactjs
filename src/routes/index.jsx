import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import HomePage from '../pages/HomePage';
import CreateCampaignPage from '../pages/CreateCampaignPage';
import CampaignDetailPage from '../pages/CampaignDetailPage';

/**
 * Application routes configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'campaign',
        element: <CampaignDetailPage />,
      },
      {
        path: 'create-campaign',
        element: <CreateCampaignPage />,
      },
    ],
  },
]);
