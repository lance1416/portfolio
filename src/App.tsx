import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout.tsx';
import Experience from '@/pages/Experience.tsx';
import Home from '@/pages/Home.tsx';
import Projects from '@/pages/Projects.tsx';

const Placeholder = ({ title }: { title: string }) => (
  <main className="mx-auto max-w-4xl px-6 text-center pt-24">
    <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
      {title}
    </h1>
    <p className="mt-6 prose-academic mx-auto">Coming soon.</p>
  </main>
);

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
        element: <Placeholder title="Research & Education" />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
