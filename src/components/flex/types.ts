import { ElementType } from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export interface FlexProps {
  gap?: number;
  column?: boolean;
  center?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
  flex?: number | string;
  component?: ElementType;
  alignSelf?:
    | 'center'
    | 'end'
    | 'flex-end'
    | 'flex-start'
    | 'self-end'
    | 'self-start'
    | 'start';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'initial'
    | 'inherit';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  alignItems?:
    | 'stretch'
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'baseline'
    | 'initial'
    | 'inherit';
}
