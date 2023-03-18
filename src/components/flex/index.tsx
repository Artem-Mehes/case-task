import { PropsWithChildren } from 'react';

import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

import { FlexProps } from './types';

export const Flex = ({
  sx,
  column,
  center,
  children,
  component,
  ...props
}: PropsWithChildren<FlexProps>) => {
  const resultSx: SxProps<Theme> = {
    display: 'flex',
    ...(center && {
      alignItems: 'center',
      justifyContent: 'center',
    }),
    ...(column && { flexDirection: 'column' }),
    ...sx,
    ...props,
  };

  return (
    <Box component={component} sx={resultSx}>
      {children}
    </Box>
  );
};
