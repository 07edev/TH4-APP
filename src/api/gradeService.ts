import {ApiGrade} from '../types/apiModels';
import {request} from './client';

export const gradeService = {
  getAll: () => request<ApiGrade[]>('GET', '/grades?_expand=course'),
  getById: (id: number) => request<ApiGrade>('GET', `/grades/${id}?_expand=course`),
};
