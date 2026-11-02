import {ApiCourse, ApiGrade} from '../types/apiModels';

export function toScale4(score: number): number {
  if (score >= 8.5) return 4;
  if (score >= 8) return 3.5;
  if (score >= 7) return 3;
  if (score >= 6.5) return 2.5;
  if (score >= 5.5) return 2;
  if (score >= 5) return 1.5;
  if (score >= 4) return 1;
  return 0;
}

export function calcGpa(grades: ApiGrade[], courses: ApiCourse[]) {
  let weightedTotal = 0;
  let totalCredits = 0;
  grades.forEach(grade => {
    const course = courses.find(item => item.id === grade.courseId);
    if (!course || grade.letter === 'F') return;
    weightedTotal += toScale4(grade.total) * course.credits;
    totalCredits += course.credits;
  });
  return {
    gpa: totalCredits ? Number((weightedTotal / totalCredits).toFixed(2)) : 0,
    totalCredits,
  };
}
