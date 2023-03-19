import { Container, styled } from '@mui/material';

export const CoursesContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  flexDirection: 'column',
  padding: `${theme.spacing(5)} 0`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));
