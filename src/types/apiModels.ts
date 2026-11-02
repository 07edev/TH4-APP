export type ApiStudent = {
  id: number;
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
  updatedAt: string;
};

export type ApiCourse = {
  id: number;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
  semester: string;
};

export type ApiSession = {
  id: number;
  courseId: number;
  date: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  note: string;
  course?: ApiCourse;
};

export type ApiAssignment = {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'done';
  updatedAt: string;
  course?: ApiCourse;
};

export type ApiGrade = {
  id: number;
  courseId: number;
  semester: string;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  course?: ApiCourse;
};
