import { useMemo } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
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
  Backdrop,
  Typography,
  IconButton,
  createTheme,
  CssBaseline,
  ButtonProps,
  useMediaQuery,
  ThemeProvider,
  CircularProgress,
} from '@mui/material';

import { Flex } from 'components';
import { useLocalStorage } from 'hooks';

import { courseQuery } from './course';

const Root = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const location = useLocation();
  const { id } = useParams();
  const isFetching = useIsFetching();
  const { data } = useQuery(courseQuery(id));
  const navigation = useNavigation();

  const [mode, setMode] = useLocalStorage<'dark' | 'light'>(
    'colorMode',
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

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleColorMode = () =>
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const toggleThemeProps: ButtonProps = {
    color: 'inherit',
    sx: { ml: 'auto' },
    onClick: toggleColorMode,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar component="header">
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
              component="h1"
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
            <Typography noWrap variant="h6" component="h2">
              {data.title}
            </Typography>
          )}

          {isMobile ? (
            <IconButton
              {...toggleThemeProps}
              aria-label="toggle color theme"
              title="Switch between dark and light mode"
            >
              {theme.palette.mode === 'dark' ? (
                <Brightness7 />
              ) : (
                <Brightness4 />
              )}
            </IconButton>
          ) : (
            <Button
              {...toggleThemeProps}
              startIcon={
                theme.palette.mode === 'dark' ? (
                  <Brightness7 />
                ) : (
                  <Brightness4 />
                )
              }
            >
              {mode === 'light' ? 'dark' : 'light'} mode
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar />

      {isFetching || navigation.state === 'loading' ? (
        <Backdrop
          open
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Outlet />
      )}
    </ThemeProvider>
  );
};

export default Root;
