import { apiInstance } from './instance';

export interface Video {
  link: string;
  duration: number;
  previewImageLink: string;
}

export interface PreviewCourse {
  id: string;
  title: string;
  tags: string[];
  rating: number;
  launchDate: string;
  description: string;
  lessonsCount: number;
  previewImageLink: string;
  meta: {
    skills?: string[];
    courseVideoPreview: Video;
  };
}

export interface Lesson extends Video {
  id: string;
  title: string;
  order: number;
  type: 'video';
  status: 'locked' | 'unlocked';
}

export interface Course extends PreviewCourse {
  lessons: Lesson[];
  duration: number;
}

const getAll = (): Promise<{ courses: PreviewCourse[] }> =>
  apiInstance.get('core/preview-courses');

const getById = (id: PreviewCourse['id']): Promise<Course> =>
  apiInstance.get(`core/preview-courses/${id}`);

export { getAll, getById };
