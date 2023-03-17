import { alpha, Box, styled } from '@mui/material';

import { PlaybackRate } from './types';

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

export const PlayerContainer = styled(Box, {
  shouldForwardProp: (propName) =>
    propName !== 'playbackRate' && propName !== 'showPlaybackRate',
})<{
  playbackRate: PlaybackRate;
  showPlaybackRate: boolean;
}>(({ playbackRate, theme, showPlaybackRate }) => ({
  paddingTop: '56.25%',
  position: 'relative',
  '::before': {
    zIndex: 1,
    top: '20%',
    left: '50%',
    height: '48px',
    display: 'flex',
    fontSize: '20px',
    borderRadius: '3px',
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    transform: 'translateX(-50%)',
    content: `"${playbackRate}x"`,
    opacity: showPlaybackRate ? 1 : 0,
    transition: 'opacity 0.25s ease-in-out',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    backgroundColor: alpha(theme.palette.background.default, 0.6),
  },
}));
