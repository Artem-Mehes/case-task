import toast from 'react-hot-toast';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import {
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
} from '@mui/material';

import Root from 'routes/root';
import Course, { courseLoader } from 'routes/course';
import Courses, { coursesLoader } from 'routes/courses';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// - Додатково:
// - при ховері відтворювати відео без звуку.
// pagination in search
// create styles files
// mobile
// no video placeholder
// 2. Додати зміну швидкості програвання відео через клавіатуру (без сторонніх бібліотек) (комбінація клавіш на власний розсуд):
// - Так же вивести інформацію біля відео як цим користуватись.
// Title of course in header if back to list. rootLoader
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { height: '100%' },
          body: { height: 'inherit' },
          '#root': { height: 'inherit' },
        }}
      />
      <RouterProvider router={router} />
    </ThemeProvider>
  </QueryClientProvider>
);
