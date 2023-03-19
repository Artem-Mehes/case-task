import { Theme } from '@mui/material';

import { globalStyles } from './config';

export const getPlural = (number: number, label: string) =>
  number === 1 ? label : `${label}s`;

export const secondsToHm = (
  seconds: number,
  options?: {
    plural?: boolean;
    type?: 'all' | 'biggest';
    label?: { minutes?: string; hours?: string };
  }
) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const { type = 'all', label, plural } = options ?? {};
  const { minutes: minLabel = 'min', hours: hLabel = 'hr' } = label ?? {};

  const displayHours =
    hours > 0 ? `${hours}${plural ? getPlural(hours, hLabel) : hLabel}` : '';
  const displayMinutes =
    minutes > 0
      ? `${minutes}${plural ? getPlural(minutes, minLabel) : minLabel}`
      : '';

  if (type === 'all') {
    return displayHours + displayMinutes;
  }

  if (type === 'biggest') {
    return displayHours || displayMinutes;
  }
};

export const getGlobalStyles = (theme: Theme) => ({
  ...globalStyles,
  '::-webkit-scrollbar': {
    width: '8px',
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
        : theme.palette.grey['400'],
    border: `1px solid ${
      theme.palette.mode === 'dark'
        ? theme.palette.grey['800']
        : theme.palette.grey['500']
    }`,
    ':hover': {
      backgroundColor: theme.palette.grey['500'],
    },
  },
});

export const getCoverUrl = (src: string) => `${src}/cover.webp`;
