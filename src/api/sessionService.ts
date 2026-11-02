import {ApiSession} from '../types/apiModels';
import {request} from './client';

export const sessionService = {
  getAll: () => request<ApiSession[]>('GET', '/sessions?_expand=course'),
  getById: (id: number) => request<ApiSession>('GET', `/sessions/${id}?_expand=course`),
  create: (data: Omit<ApiSession, 'id' | 'course'>) => request<ApiSession>('POST', '/sessions', data),
};
