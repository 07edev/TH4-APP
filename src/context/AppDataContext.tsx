import React, {createContext, PropsWithChildren, useCallback, useContext, useMemo} from 'react';
import {assignmentService} from '../api/assignmentService';
import {courseService} from '../api/courseService';
import {gradeService} from '../api/gradeService';
import {sessionService} from '../api/sessionService';
import {studentService} from '../api/studentService';
import {CACHE_KEYS} from '../storage/keys';
import {ApiAssignment, ApiCourse, ApiGrade, ApiSession, ApiStudent} from '../types/apiModels';
import {useCachedQuery} from '../hooks/useCachedQuery';

type AppDataContextValue = {
  student: ReturnType<typeof useCachedQuery<ApiStudent>>;
  courses: ReturnType<typeof useCachedQuery<ApiCourse[]>>;
  sessions: ReturnType<typeof useCachedQuery<ApiSession[]>>;
  assignments: ReturnType<typeof useCachedQuery<ApiAssignment[]>>;
  grades: ReturnType<typeof useCachedQuery<ApiGrade[]>>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({children}: PropsWithChildren) {
  const getStudent = useCallback(() => studentService.getById(1), []);
  const getCourses = useCallback(() => courseService.getAll(), []);
  const getSessions = useCallback(() => sessionService.getAll(), []);
  const getAssignments = useCallback(() => assignmentService.getAll(), []);
  const getGrades = useCallback(() => gradeService.getAll(), []);
  const student = useCachedQuery(CACHE_KEYS.student, getStudent);
  const courses = useCachedQuery(CACHE_KEYS.courses, getCourses);
  const sessions = useCachedQuery(CACHE_KEYS.sessions, getSessions);
  const assignments = useCachedQuery(CACHE_KEYS.assignments, getAssignments);
  const grades = useCachedQuery(CACHE_KEYS.grades, getGrades);
  const value = useMemo(() => ({student, courses, sessions, assignments, grades}), [student, courses, sessions, assignments, grades]);
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside AppDataProvider');
  return context;
}
