import { styled, Card as MuiCard } from '@mui/material';

export const Card = styled(MuiCard)(({ theme }) => ({
  width: '100%',
  cursor: 'pointer',
  [theme.breakpoints.up('sm')]: {
    transition: 'transform 0.15s ease-in-out',
    ':hover': {
      transform: 'scale3d(1.05, 1.05, 1)',
      backgroundColor:
        theme.palette.mode === 'light'
          ? theme.palette.grey['300']
          : theme.palette.grey['900'],
    },
  },
}));
