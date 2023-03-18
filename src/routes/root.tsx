import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useIsFetching, useQuery } from '@tanstack/react-query';
import { LaptopMac, Brightness4, Brightness7 } from '@mui/icons-material';
import {
  Outlet,
  useParams,
  useLocation,
  useNavigation,
} from 'react-router-dom';
import {
  AppBar,
  Button,
  Toolbar,
  Divider,
  Typography,
  createTheme,
  CssBaseline,
  GlobalStyles,
  useMediaQuery,
  ThemeProvider,
} from '@mui/material';

import { Loader } from 'icons';
import { Flex } from 'components';

import { courseQuery } from './course';
import { getGlobalStyles } from './utils';

const Root = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const location = useLocation();
  const { id } = useParams();
  const isFetching = useIsFetching();
  const { data } = useQuery(courseQuery(id));
  const navigation = useNavigation();

  const [mode, setMode] = useState<'dark' | 'light'>(
    prefersDarkMode ? 'dark' : 'light'
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const globalStyles = useMemo(() => getGlobalStyles(theme), [theme]);

  const toggleColorMode = () =>
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />

      <AppBar component="nav">
        <Toolbar sx={{ display: 'flex', gap: 4 }}>
          <Flex
            gap={1}
            alignItems="center"
            sx={{
              display: {
                md: 'flex',
                xs: location.pathname === '/' ? 'flex' : 'none',
              },
            }}
          >
            <LaptopMac />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Courses app
            </Typography>
          </Flex>

          <Divider
            flexItem
            variant="middle"
            orientation="vertical"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          />

          {data && navigation.state !== 'loading' && (
            <Typography noWrap variant="h6">
              {data.title}
            </Typography>
          )}

          <Button
            color="inherit"
            onClick={toggleColorMode}
            sx={{ ml: 'auto' }}
            startIcon={
              theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />
            }
          >
            {mode} mode
          </Button>
        </Toolbar>
      </AppBar>

      {isFetching || navigation.state === 'loading' ? (
        <Flex alignItems="center" sx={{ height: 'inherit' }}>
          <Loader />
        </Flex>
      ) : (
        <>
          <Toolbar />
          <Outlet />
        </>
      )}

      <Toaster />
    </ThemeProvider>
  );
};

export default Root;
