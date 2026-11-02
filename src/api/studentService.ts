import {ApiStudent} from '../types/apiModels';
import {request} from './client';

export const studentService = {
  getById: (id: number) => request<ApiStudent>('GET', `/students/${id}`),
  update: (id: number, data: Partial<ApiStudent>) => request<ApiStudent>('PATCH', `/students/${id}`, data),
};
