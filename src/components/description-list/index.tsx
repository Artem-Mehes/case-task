import { Fragment } from 'react';
import { Box, Divider, useMediaQuery, useTheme } from '@mui/material';

import { Flex } from 'components';

import { DescriptionListProps } from './types';

export const DescriptionList = ({ items }: DescriptionListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="dl"
      sx={{ gap: 2, display: 'flex', flexDirection: 'column', m: 0 }}
    >
      {items.map((item, index) => (
        <Fragment key={index}>
          <Flex gap={2} column={isMobile}>
            <Box component="dt" sx={{ flex: '0 0 20%' }}>
              {item.title}
            </Box>

            <Flex gap={1} component="dd" flexWrap="wrap" sx={{ m: 0 }}>
              {item.details}
            </Flex>
          </Flex>

          <Divider />
        </Fragment>
      ))}
    </Box>
  );
};
