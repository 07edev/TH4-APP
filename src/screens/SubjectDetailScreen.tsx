import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {RootScreenProps} from '../navigation/navigationTypes';
import {subjects} from '../data/subjects';
import {initialAssignments} from '../data/assignments';
import {schedules} from '../data/schedules';
import {ScreenContainer} from '../components/ScreenContainer';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {Subject} from '../types/models';
import {useAppData} from '../context/AppDataContext';
import {LoadingView} from '../components/LoadingView';

export function SubjectDetailScreen({route}: RootScreenProps<'SubjectDetail'>) {
  const {courses, assignments, sessions} = useAppData();
  const apiSubject = courses.data?.find(item => String(item.id) === route.params.subjectId);

  if (courses.loading && !courses.data) {
    return <ScreenContainer><LoadingView /></ScreenContainer>;
  }

  if (apiSubject) {
    const subjectAssignments = (assignments.data ?? []).filter(item => item.courseId === apiSubject.id);
    const subjectSessions = (sessions.data ?? []).filter(item => item.courseId === apiSubject.id);
    return <ScreenContainer><ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{apiSubject.name}</Text>
      <Text style={styles.code}>{apiSubject.code} · {apiSubject.credits} tín chỉ</Text>
      <Text style={styles.label}>Giảng viên</Text>
      <Text style={styles.value}>{apiSubject.lecturer}</Text>
      <Text style={styles.label}>Học kỳ</Text>
      <Text style={styles.value}>{apiSubject.semester}</Text>
      <Text style={styles.label}>Mô tả</Text>
      <Text style={styles.value}>{apiSubject.description}</Text>
      <Text style={styles.label}>Bài tập ({subjectAssignments.length})</Text>
      {subjectAssignments.length > 0
        ? subjectAssignments.map(item => <Text key={item.id} style={styles.item}>• {item.title}</Text>)
        : <Text style={styles.value}>Chưa có bài tập.</Text>}
      <Text style={styles.label}>Lịch học ({subjectSessions.length})</Text>
      {subjectSessions.length > 0
        ? subjectSessions.map(item => <Text key={item.id} style={styles.item}>• Thứ {item.dayOfWeek}, {item.startTime} - {item.endTime}, {item.room}</Text>)
        : <Text style={styles.value}>Chưa có lịch học.</Text>}
    </ScrollView></ScreenContainer>;
  }

  const subject: Subject | undefined = subjects.find(item => item.id === route.params.subjectId);
  if (!subject) return <ScreenContainer><Text style={styles.error}>Không tìm thấy môn học.</Text></ScreenContainer>;
  return <ScreenContainer><ScrollView contentContainerStyle={styles.content}><Text style={styles.heading}>{subject.name}</Text><Text style={styles.code}>{subject.code} · {subject.credits} tín chỉ</Text><Text style={styles.label}>Giảng viên</Text><Text style={styles.value}>{subject.lecturer}</Text><Text style={styles.label}>Phòng học</Text><Text style={styles.value}>{subject.room}</Text><Text style={styles.label}>Học kỳ</Text><Text style={styles.value}>{subject.semester}</Text><Text style={styles.label}>Mô tả</Text><Text style={styles.value}>{subject.description}</Text><Text style={styles.label}>Bài tập ({initialAssignments.filter(item => item.subjectId === subject.id).length})</Text>{initialAssignments.filter(item => item.subjectId === subject.id).map(item => <Text key={item.id} style={styles.item}>• {item.title}</Text>)}<Text style={styles.label}>Lịch học ({schedules.filter(item => item.subjectId === subject.id).length})</Text>{schedules.filter(item => item.subjectId === subject.id).map(item => <Text key={item.id} style={styles.item}>• {item.dayOfWeek}, {item.startTime} - {item.endTime}, {item.room}</Text>)}</ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({content: {padding: spacing.lg}, heading: {fontSize: 25, fontWeight: '800', color: colors.text}, code: {color: colors.primary, fontWeight: '700', marginTop: 8}, label: {fontWeight: '800', color: colors.text, marginTop: spacing.xl}, value: {color: colors.mutedText, marginTop: 6, lineHeight: 22}, item: {color: colors.text, marginTop: spacing.sm}, error: {padding: spacing.lg, color: colors.danger}});
