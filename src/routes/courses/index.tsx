import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { Grid, Container, Pagination, PaginationProps } from '@mui/material';

import api from 'api';
import { PreviewCourse } from 'api/courses';
import { useTitle, useSearchParams } from 'hooks';

import { Card } from './card';

const coursesQuery = {
  queryKey: ['courses'],
  queryFn: api.courses.getAll,
};

export const coursesLoader = (queryClient: QueryClient) => async () =>
  queryClient.getQueryData(coursesQuery.queryKey) ??
  (await queryClient.fetchQuery(coursesQuery));

const itemsPerPage = 12;

const Courses = () => {
  // TODO
  const initialData = useLoaderData() as { courses: PreviewCourse[] };

  useTitle('Courses');

  const [page, setPage] = useSearchParams('page', '1');

  const { data } = useQuery({
    ...coursesQuery,
    initialData,
    select: (queryData) => queryData.courses,
  });

  const onPageChange: PaginationProps['onChange'] = (e, value) => {
    setPage(String(value));
    window.scrollTo({ top: 0 });
  };

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const items = useMemo(() => {
    const begin = (+page - 1) * itemsPerPage;
    const end = begin + itemsPerPage;

    return data.slice(begin, end);
  }, [page, data]);

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
      <Grid container spacing={5} columns={6} alignItems="stretch">
        {items.map((course) => (
          <Grid
            item
            md={3}
            lg={2}
            key={course.id}
            sx={{ display: 'flex', width: '100%' }}
          >
            <Card data={course} />
          </Grid>
        ))}
      </Grid>

      {items && (
        <Pagination
          page={+page}
          shape="rounded"
          count={pageCount}
          variant="outlined"
          onChange={onPageChange}
        />
      )}
    </Container>
  );
};

export default Courses;
