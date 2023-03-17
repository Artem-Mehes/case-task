import { useMemo, useState } from 'react';
import { QueryClient, useQuery } from 'react-query';
import { Grid, Container, Pagination, PaginationProps } from '@mui/material';

import api from 'api';

import { Card } from './card';

const coursesQuery = {
  queryKey: 'courses',
  queryFn: api.courses.getAll,
};

export const coursesLoader = (queryClient: QueryClient) => async () =>
  queryClient.getQueryData(coursesQuery.queryKey) ??
  (await queryClient.fetchQuery(coursesQuery));

const itemsPerPage = 12;

const Courses = () => {
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    ...coursesQuery,
    select: (queryData) => queryData.courses,
  });

  const onPageChange: PaginationProps['onChange'] = (e, value) => {
    setPage(value);
    window.scrollTo({ top: 0 });
  };

  const pageCount = data && Math.ceil(data.length / itemsPerPage);

  const items = useMemo(() => {
    if (data) {
      const begin = (page - 1) * itemsPerPage;
      const end = begin + itemsPerPage;

      return data.slice(begin, end);
    }
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
        {items?.map((course) => (
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
