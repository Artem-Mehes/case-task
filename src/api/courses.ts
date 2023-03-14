import { Course } from 'types';

import { apiInstance } from './instance';

const getAll = (): Promise<{ courses: Course[] }> =>
  apiInstance.get('core/preview-courses');

const getById = (id: Course['id']) =>
  apiInstance.get(`core/preview-courses/${id}`);

export { getAll, getById };
