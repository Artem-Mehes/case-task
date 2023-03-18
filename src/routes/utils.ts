import { Theme } from '@mui/material';

export const getGlobalStyles = (theme: Theme) => ({
  html: { height: '100%' },
  body: { height: 'inherit' },
  '#root': { height: 'inherit' },
  '::-webkit-scrollbar': {
    width: '7px',
  },
  '::-webkit-scrollbar-track': {
    background:
      theme.palette.mode === 'dark'
        ? theme.palette.grey['900']
        : theme.palette.grey['200'],
  },
  '::-webkit-scrollbar-thumb': {
    borderRadius: '4px',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.grey['600']
        : theme.palette.grey['300'],
    border: `1px solid ${
      theme.palette.mode === 'dark'
        ? theme.palette.grey['800']
        : theme.palette.grey['400']
    }`,
    ':hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.grey['500']
          : theme.palette.grey['400'],
    },
  },
});
