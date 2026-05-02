import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import Experience from '@/pages/Experience.tsx';
import Home from '@/pages/Home.tsx';
import NotFound from '@/pages/NotFound.tsx';
import Projects from '@/pages/Projects.tsx';
import Research from '@/pages/Research.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'experience',
        element: <Experience />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'research',
        element: <Research />,
      },
      // 404 Catch-all route
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
