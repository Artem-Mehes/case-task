import { yellow } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { QueryClient, useQuery } from 'react-query';
import { useEffect, useMemo, useState } from 'react';
import { Star, VideoLibrary } from '@mui/icons-material';
import {
  Box,
  Chip,
  Grid,
  CardMedia,
  Container,
  Pagination,
  Typography,
  PaginationProps,
} from '@mui/material';

import api from 'api';

import * as Styles from './styles';

const coursesQuery = {
  queryKey: 'courses',
  queryFn: api.courses.getAll,
};

export const coursesLoader = (queryClient: QueryClient) => async () =>
  queryClient.getQueryData(coursesQuery.queryKey) ??
  (await queryClient.fetchQuery(coursesQuery));

const itemsPerPage = 12;

const Courses = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const { data } = useQuery({
    ...coursesQuery,
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
    <Container
      maxWidth="xl"
      sx={{
        gap: 3,
        paddingY: 5,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Grid container spacing={5} columns={3} alignItems="stretch">
        {items?.map((course) => (
          <Grid item md={3} lg={1} key={course.id} sx={{ display: 'flex' }}>
            <Styles.Card onClick={() => navigate(course.id)}>
              <CardMedia
                height="300"
                component="img"
                title={course.title}
                image={`${course.previewImageLink}/cover.webp`}
              />
              <Styles.CardContent>
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
              </Styles.CardContent>
            </Styles.Card>
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
  );
};

export default Courses;
