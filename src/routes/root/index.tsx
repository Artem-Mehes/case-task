import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Toaster } from 'react-hot-toast';
import { yellow } from '@mui/material/colors';
import { QueryClient, useQuery } from 'react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { LaptopMac, Star, VideoLibrary } from '@mui/icons-material';
import {
  Box,
  Card,
  Grid,
  Chip,
  AppBar,
  Toolbar,
  CardMedia,
  Container,
  Typography,
  Pagination,
  CardContent,
  createTheme,
  CssBaseline,
  ThemeProvider,
  PaginationProps,
} from '@mui/material';

import api from 'api';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const rootQuery = {
  queryKey: 'courses',
  queryFn: api.courses.getAll,
};

const itemsPerPage = 10;

export const rootLoader = (queryClient: QueryClient) => async () =>
  queryClient.getQueryData(rootQuery.queryKey) ??
  (await queryClient.fetchQuery(rootQuery));

const Root = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof rootLoader>>
  >;

  const [page, setPage] = useState(1);

  const { data } = useQuery({
    ...initialData,
    ...rootQuery,
    select: (queryData) => queryData.courses,
  });

  const onPageChange: PaginationProps['onChange'] = (e, value) =>
    setPage(value);

  const pageCount = data && Math.ceil(data.length / itemsPerPage);

  const items = useMemo(() => {
    if (data) {
      const begin = (page - 1) * itemsPerPage;
      const end = begin + itemsPerPage;

      return data.slice(begin, end);
    }
  }, [page, data]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [items]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar sx={{ display: 'flex', gap: 2 }}>
          <LaptopMac />
          <Typography
            to="/"
            variant="h6"
            component={Link}
            sx={{
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Courses app
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          gap: 2,
          paddingY: 5,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Grid container spacing={5} columns={3} alignItems="stretch">
          {items?.map((course) => (
            <Grid item md={3} lg={1} key={course.id} sx={{ display: 'flex' }}>
              <Card>
                <CardMedia
                  component="img"
                  title={course.title}
                  image={`${course.previewImageLink}/cover.webp`}
                  height="300"
                />
                <CardContent
                  sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h5">{course.title}</Typography>

                    <Box sx={{ display: 'flex', gap: 1, ml: 4 }}>
                      <Star sx={{ color: yellow[500] }} />
                      {course.rating}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <VideoLibrary />
                    {course.lessonsCount} lessons
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {course.meta.skills?.map((skill, index) => (
                      <Chip key={index} size="small" label={skill} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {items && (
          <Pagination
            page={page}
            count={pageCount}
            shape="rounded"
            variant="outlined"
            onChange={onPageChange}
          />
        )}
      </Container>

      <Toaster />
    </ThemeProvider>
  );
};

export default Root;
