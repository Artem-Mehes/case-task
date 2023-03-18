import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useIsFetching, useQuery } from 'react-query';
import { LaptopMac, Brightness4, Brightness7 } from '@mui/icons-material';
import {
  Outlet,
  useParams,
  useLocation,
  useNavigation,
} from 'react-router-dom';
import {
  Box,
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

import { courseQuery } from './course';

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

  const toggleColorMode = () =>
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { height: '100%' },
          body: { height: 'inherit' },
          '#root': { height: 'inherit' },
          '::-webkit-scrollbar': {
            width: '7px',
          },
          '::-webkit-scrollbar-track': {
            background:
              mode === 'dark'
                ? theme.palette.grey['900']
                : theme.palette.grey['200'],
          },
          '::-webkit-scrollbar-thumb': {
            borderRadius: '4px',
            backgroundColor:
              mode === 'dark'
                ? theme.palette.grey['600']
                : theme.palette.grey['300'],
            border: `1px solid ${
              mode === 'dark'
                ? theme.palette.grey['800']
                : theme.palette.grey['400']
            }`,
            ':hover': {
              backgroundColor:
                mode === 'dark'
                  ? theme.palette.grey['500']
                  : theme.palette.grey['400'],
            },
          },
        }}
      />

      <AppBar component="nav">
        <Toolbar sx={{ display: 'flex', gap: 4 }}>
          <Box
            sx={{
              gap: 1,
              alignItems: 'center',
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
          </Box>

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
        <Box sx={{ display: 'flex', alignItems: 'center', height: 'inherit' }}>
          <Loader />
        </Box>
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
