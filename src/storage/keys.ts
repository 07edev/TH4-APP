export const CACHE_KEYS = {
  student: 'cache:student',
  courses: 'cache:courses',
  sessions: 'cache:sessions',
  assignments: 'cache:assignments',
  grades: 'cache:grades',
} as const;

export const OUTBOX_KEY = 'offline:outbox';
