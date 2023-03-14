import React from 'react';
import toast from 'react-hot-toast';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';

import Root, { rootLoader } from 'routes/root';

// pagination in search
// create styles files
// TODO: style toast
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
    loader: rootLoader(queryClient),
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
