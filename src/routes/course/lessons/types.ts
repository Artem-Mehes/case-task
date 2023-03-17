import { Dispatch, SetStateAction } from 'react';

import { Course } from 'api/courses';

import { Progress } from '../types';

export interface LessonsProps extends Partial<Pick<Course, 'lessons'>> {
  progress: Progress;
  setProgress: Dispatch<SetStateAction<Progress>>;
}
