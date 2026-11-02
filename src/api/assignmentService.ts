import {ApiAssignment} from '../types/apiModels';
import {request} from './client';

export const assignmentService = {
  getAll: () => request<ApiAssignment[]>('GET', '/assignments?_expand=course&_sort=dueDate'),
  getById: (id: number) => request<ApiAssignment>('GET', `/assignments/${id}?_expand=course`),
  update: (id: number, data: Partial<ApiAssignment>) => request<ApiAssignment>('PATCH', `/assignments/${id}`, data),
  create: (data: Omit<ApiAssignment, 'id' | 'course'>) => request<ApiAssignment>('POST', '/assignments', data),
};
