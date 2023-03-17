import { Course } from 'api/courses';

export interface Progress {
  active: Course['id'];

  [key: string]: number | Course['id'];
}

export const PlaybackRateOptions = [
  0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2,
] as const;
export type PlaybackRate = (typeof PlaybackRateOptions)[number];
