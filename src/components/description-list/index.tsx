import { Fragment } from 'react';
import { Box, Divider } from '@mui/material';

import { DescriptionListProps } from './types';

export const DescriptionList = ({ items }: DescriptionListProps) => {
  return (
    <Box
      component="dl"
      sx={{ gap: 2, display: 'flex', flexDirection: 'column', m: 0 }}
    >
      {items.map((item, index) => (
        <Fragment key={index}>
          <Box sx={{ display: 'flex' }}>
            <Box component="dt" sx={{ flexBasis: '20%', flexShrink: 0 }}>
              {item.title}
            </Box>

            <Box
              component="dd"
              sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', m: 0 }}
            >
              {item.details}
            </Box>
          </Box>

          <Divider />
        </Fragment>
      ))}
    </Box>
  );
};
