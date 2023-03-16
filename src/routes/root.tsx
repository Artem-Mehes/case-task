import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Toaster } from 'react-hot-toast';
import { LaptopMac } from '@mui/icons-material';
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
  useParams,
} from 'react-router-dom';
import { useIsFetching, useQuery } from 'react-query';
import { AppBar, Toolbar, Typography, Box, Divider } from '@mui/material';

import { Loader } from 'icons';

import { courseQuery } from './course';

const Root = () => {
  const props = useLoaderData();
  const location = useLocation();
  const { id } = useParams();
  const isFetching = useIsFetching();
  const { data, ...rest } = useQuery(courseQuery(id));

  const navigation = useNavigation();

  console.log(props);

  return (
    <>
      <AppBar component="nav">
        <Toolbar sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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

          <Divider orientation="vertical" variant="middle" flexItem />

          {data && <Typography variant="h6">{data.title}</Typography>}
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
