import {ApiCourse} from '../types/apiModels';
import {request} from './client';

export const courseService = {
  getAll: () => request<ApiCourse[]>('GET', '/courses'),
  getById: (id: number) => request<ApiCourse>('GET', `/courses/${id}`),
};
