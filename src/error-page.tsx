import * as React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { Button, GlobalStyles, Typography } from '@mui/material';

import { Flex } from 'components';
import { globalStyles } from 'config';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <GlobalStyles styles={globalStyles} />
      <Flex center column gap={3} sx={{ height: '100%' }}>
        <Flex center column>
          <Typography variant="h1">Oops!</Typography>
          <Typography>Sorry, an unexpected error has occurred.</Typography>
          {error instanceof Error && (
            <Typography color="error">{error.message}</Typography>
          )}
        </Flex>

        <Button variant="contained" component={Link} to="/">
          Go back to home
        </Button>
      </Flex>
    </>
  );
}
