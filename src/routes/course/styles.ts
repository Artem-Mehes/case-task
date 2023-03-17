import { Box, styled } from '@mui/material';

export const ShortcutButton = styled('span')(({ theme }) => ({
  fontSize: '12px',
  fontWeight: '500',
  padding: '2px 8px',
  borderRadius: '4px',
  color: theme.palette.common.black,
  backgroundColor: theme.palette.grey['500'],
}));

export const SidebarContainer = styled(Box)(({ theme }) => ({
  right: 0,
  zIndex: 1,
  width: '25%',
  display: 'none',
  position: 'fixed',
  flexDirection: 'column',
  height: `calc(100% - 64px)`,
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
  },
}));

export const MainContent = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: theme.spacing(2),
  flexDirection: 'column',
  [theme.breakpoints.up('lg')]: {
    width: '75%',
  },
}));
