import { useLoaderData } from 'react-router-dom';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { Grid, Pagination, PaginationProps } from '@mui/material';

import api from 'api';
import { useTitle, useSearchParams } from 'hooks';

import { Card } from './card';
import * as Styles from './styles';

const coursesQuery = {
  queryKey: ['courses'],
  queryFn: api.courses.getAll,
};

export const coursesLoader =
  (queryClient: QueryClient): (() => ReturnType<typeof coursesQuery.queryFn>) =>
  async () =>
    queryClient.getQueryData(coursesQuery.queryKey) ??
    (await queryClient.fetchQuery(coursesQuery));

const itemsPerPage = 12;

const Courses = () => {
  useTitle('Courses');
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof coursesLoader>>
  >;

  const { data } = useQuery({
    ...coursesQuery,
    initialData,
    select: (queryData) => queryData.courses,
  });

  const [page, setPage] = useSearchParams('page', '1');

  const onPageChange: PaginationProps['onChange'] = (e, value) => {
    setPage(String(value));
    window.scrollTo({ top: 0 });
  };

  const pageCount = Math.ceil(data.length / itemsPerPage);
  const begin = (+page - 1) * itemsPerPage;
  const end = begin + itemsPerPage;
  const items = data.slice(begin, end);

  return (
    <Styles.CoursesContainer maxWidth="xl">
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
    </Styles.CoursesContainer>
  );
};

export default Courses;
