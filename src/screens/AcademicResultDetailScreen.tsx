import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {RootScreenProps} from '../navigation/navigationTypes';
import {results} from '../data/results';
import {subjects} from '../data/subjects';
import {ScreenContainer} from '../components/ScreenContainer';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {useAppData} from '../context/AppDataContext';
import {LoadingView} from '../components/LoadingView';

export function AcademicResultDetailScreen({route}: RootScreenProps<'AcademicResultDetail'>) {
  const {grades, courses} = useAppData();
  const apiResult = grades.data?.find(item => String(item.id) === route.params.resultId);
  const apiSubject = apiResult?.course ?? courses.data?.find(item => item.id === apiResult?.courseId);

  if (grades.loading && !grades.data) {
    return <ScreenContainer><LoadingView /></ScreenContainer>;
  }

  if (apiResult && apiSubject) {
    const passed = apiResult.total >= 4;
    return <ScreenContainer><ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{apiSubject.name}</Text>
      <Text style={styles.value}>{apiResult.semester}</Text>
      <Text style={styles.label}>Điểm chuyên cần</Text>
      <Text style={styles.score}>{apiResult.attendance}</Text>
      <Text style={styles.label}>Điểm giữa kỳ</Text>
      <Text style={styles.score}>{apiResult.midterm}</Text>
      <Text style={styles.label}>Điểm cuối kỳ</Text>
      <Text style={styles.score}>{apiResult.final}</Text>
      <Text style={styles.label}>Điểm tổng kết</Text>
      <Text style={styles.score}>{apiResult.total} ({apiResult.letter})</Text>
      <Text style={[styles.status, !passed && styles.failed]}>Trạng thái: {passed ? 'Đạt' : 'Chưa đạt'}</Text>
    </ScrollView></ScreenContainer>;
  }

  const result = results.find(item => item.id === route.params.resultId);
  const subject = result && subjects.find(item => item.id === result.subjectId);
  if (!result || !subject) return <ScreenContainer><Text style={styles.error}>Không tìm thấy kết quả.</Text></ScreenContainer>;
  return <ScreenContainer><ScrollView contentContainerStyle={styles.content}><Text style={styles.heading}>{subject.name}</Text><Text style={styles.value}>{result.semester}</Text><Text style={styles.label}>Điểm quá trình</Text><Text style={styles.score}>{result.processScore}</Text><Text style={styles.label}>Điểm thi</Text><Text style={styles.score}>{result.examScore}</Text><Text style={styles.label}>Điểm tổng kết</Text><Text style={styles.score}>{result.finalScore} ({result.letterGrade})</Text><Text style={styles.status}>Trạng thái: {result.status === 'passed' ? 'Đạt' : 'Chưa đạt'}</Text></ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({content: {padding: spacing.lg}, heading: {fontSize: 25, fontWeight: '800', color: colors.text}, label: {fontWeight: '800', color: colors.text, marginTop: spacing.xl}, value: {color: colors.mutedText, marginTop: 6}, score: {fontSize: 24, color: colors.primary, fontWeight: '800', marginTop: 6}, status: {color: colors.success, fontWeight: '800', marginTop: spacing.xl}, failed: {color: colors.danger}, error: {padding: spacing.lg, color: colors.danger}});
