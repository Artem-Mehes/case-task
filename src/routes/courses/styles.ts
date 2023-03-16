import {
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
  cursor: 'pointer',
  transition: 'transform 0.15s ease-in-out',
  ':hover': {
    transform: 'scale3d(1.05, 1.05, 1)',
    backgroundColor: theme.palette.grey['900'],
  },
}));
