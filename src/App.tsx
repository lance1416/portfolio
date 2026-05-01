import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout.tsx';
import Experience from '@/pages/Experience.tsx';
import Home from '@/pages/Home.tsx';
import Projects from '@/pages/Projects.tsx';
import Research from '@/pages/Research.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
