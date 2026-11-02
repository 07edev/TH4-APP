import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  MainTabs: undefined;
  SubjectDetail: {subjectId: string};
  ScheduleDetail: {scheduleId: string};
  AssignmentDetail: {assignmentId: string};
  AcademicResultDetail: {resultId: string};
  EditProfile: undefined;
  AssignmentForm: undefined;
  ScheduleForm: {date: string};
};

export type RootScreenProps<RouteName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, RouteName>;

export type TabParamList = {
  Overview: undefined;
  Subjects: undefined;
  Schedule: undefined;
  Assignments: undefined;
  Profile: undefined;
};
