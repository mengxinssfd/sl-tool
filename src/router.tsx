import { createHashRouter, RouteObject } from 'react-router-dom';
import { NotFountLayout } from '@/layouts/NotFound.layout';
import { ErrorLayout } from '@/layouts/Error.layout';
import { AppLayout } from '@/layouts/App.layout';
import { App } from './App';

export const baseRouter: RouteObject[] = [
  // {
  //   element: import.meta.glob('tsx path'),
  //   name: '',
  //   path: '/path',
  // },
];

export const router = createHashRouter([
  {
    children: [
      {
        element: <App />,
        path: '/',
      },
      ...baseRouter,
    ],
    errorElement: <ErrorLayout />,
    element: <AppLayout />,
    path: '',
  },
  {
    element: <NotFountLayout />,
    path: '*',
  },
]);
