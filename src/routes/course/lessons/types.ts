import { Course } from 'api/courses';

import { OnSelectLesson, Progress } from '../types';

export interface LessonsProps extends Partial<Pick<Course, 'lessons'>> {
  progress: Progress;
  onSelectLesson: OnSelectLesson;
}
