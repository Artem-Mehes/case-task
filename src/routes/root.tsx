import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Toaster } from 'react-hot-toast';
import { LaptopMac } from '@mui/icons-material';
import { useIsFetching, useQuery } from 'react-query';
import { AppBar, Toolbar, Typography, Box, Divider } from '@mui/material';
import {
  Outlet,
  useParams,
  useLocation,
  useNavigation,
} from 'react-router-dom';

import { Loader } from 'icons';

import { courseQuery } from './course';

const Root = () => {
  const location = useLocation();
  const { id } = useParams();
  const isFetching = useIsFetching();
  const { data } = useQuery(courseQuery(id));

  const navigation = useNavigation();

  return (
    <>
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
    </>
  );
};

export default Root;
