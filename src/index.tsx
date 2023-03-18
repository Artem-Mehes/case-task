import toast from 'react-hot-toast';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Root from 'routes/root';
import Course, { courseLoader } from 'routes/course';
import Courses, { coursesLoader } from 'routes/courses';

// create styles files
// TODO: style toast
// router error page
// useLoaderData
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 10,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      let message;

      if (error instanceof Error) {
        message = `Something went wrong: ${error.message}`;
      } else {
        message = 'Something went wrong';
      }

      toast.error(message);
    },
  }),
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <>Error</>,
    children: [
      {
        index: true,
        element: <Courses />,
        loader: coursesLoader(queryClient),
      },
      {
        path: ':id',
        element: <Course />,
        loader: courseLoader(queryClient),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
