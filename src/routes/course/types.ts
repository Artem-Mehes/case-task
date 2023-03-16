import { Course } from 'api/courses';

export interface Progress {
  active: Course['id'];

  [key: string]: number | Course['id'];
}
