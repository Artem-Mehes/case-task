import {
  Box,
  styled,
  Card as MuiCard,
  CardContent as MuiCardContent,
} from '@mui/material';

export const CardContent = styled(MuiCardContent)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexDirection: 'column',
}));

export const Card = styled(MuiCard)(({ theme }) => ({
  width: '100%',
  cursor: 'pointer',
  [theme.breakpoints.up('sm')]: {
    transition: 'transform 0.15s ease-in-out',
    ':hover': {
      transform: 'scale3d(1.05, 1.05, 1)',
      backgroundColor: theme.palette.grey['900'],
    },
  },
}));

export const CardTitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    gap: theme.spacing(3),
  },
}));
