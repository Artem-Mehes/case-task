import * as React from 'react';
import { Button, Typography } from '@mui/material';
import { Link, useRouteError } from 'react-router-dom';

import { Flex } from 'components';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <Flex center column sx={{ height: '100%' }}>
      <Typography variant="h1">Oops!</Typography>
      <Typography>Sorry, an unexpected error has occurred.</Typography>
      <p>
        <Typography color="error">
          {error instanceof Error ? error.message : 'Error'}
        </Typography>
      </p>

      <Button variant="contained" component={Link} to="/">
        Go back to home
      </Button>
    </Flex>
  );
}
