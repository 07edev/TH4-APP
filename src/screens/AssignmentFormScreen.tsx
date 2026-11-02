import React, {useMemo, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, TextInput} from 'react-native';
import {RootScreenProps} from '../navigation/navigationTypes';
import {useAppData} from '../context/AppDataContext';
import {useNetworkStatus} from '../hooks/useNetworkStatus';
import {assignmentService} from '../api/assignmentService';
import {enqueue} from '../storage/outbox';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {ScreenContainer} from '../components/ScreenContainer';

export function AssignmentFormScreen({navigation}: RootScreenProps<'AssignmentForm'>) {
  const {courses, assignments} = useAppData();
  const {isOnline} = useNetworkStatus();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-12-01T23:59:00Z');
  const [courseId, setCourseId] = useState<number | null>(null);
  const selectedCourse = useMemo(() => courseId ?? courses.data?.[0]?.id ?? 1, [courseId, courses.data]);

  const submit = async () => {
    if (!title.trim()) {
      Alert.alert('Thiếu thông tin', 'Tiêu đề bài tập không được để trống.');
      return;
    }
    if (new Date(dueDate).getTime() <= Date.now()) {
      Alert.alert('Hạn nộp không hợp lệ', 'Hạn nộp phải ở trong tương lai.');
      return;
    }
    const body = {courseId: selectedCourse, title: title.trim(), description: description.trim(), dueDate, status: 'todo' as const, updatedAt: new Date().toISOString()};
    try {
      if (isOnline) {
        await assignmentService.create(body);
      } else {
        await enqueue({id: `assignment-create-${Date.now()}`, method: 'POST', url: '/assignments', body, createdAt: new Date().toISOString()});
      }
      if (isOnline) await assignments.refresh();
      Alert.alert('Thành công', isOnline ? 'Đã thêm bài tập.' : 'Đã lưu vào hàng đợi đồng bộ.');
      navigation.goBack();
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm bài tập. Vui lòng thử lại.');
    }
  };

  return <ScreenContainer><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.label}>Tên bài tập</Text>
    <TextInput value={title} onChangeText={setTitle} placeholder="Ví dụ: Thực hành 5" style={styles.input} />
    <Text style={styles.label}>Mô tả</Text>
    <TextInput value={description} onChangeText={setDescription} placeholder="Mô tả yêu cầu..." multiline style={[styles.input, styles.multiline]} />
    <Text style={styles.label}>Hạn nộp (ISO 8601)</Text>
    <TextInput value={dueDate} onChangeText={setDueDate} style={styles.input} />
    <Text style={styles.label}>Môn học</Text>
    {(courses.data ?? []).map(course => <Pressable key={course.id} onPress={() => setCourseId(course.id)} style={[styles.course, selectedCourse === course.id && styles.selected]}><Text style={selectedCourse === course.id ? styles.selectedText : styles.courseText}>{course.code} - {course.name}</Text></Pressable>)}
    <Pressable style={styles.button} onPress={submit}><Text style={styles.buttonText}>Lưu bài tập</Text></Pressable>
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: {padding: spacing.lg},
  label: {fontWeight: '800', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm},
  input: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md, color: colors.text},
  multiline: {minHeight: 100, textAlignVertical: 'top'},
  course: {padding: spacing.md, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm, backgroundColor: colors.surface},
  selected: {backgroundColor: colors.primary, borderColor: colors.primary},
  courseText: {color: colors.text}, selectedText: {color: colors.surface, fontWeight: '700'},
  button: {backgroundColor: colors.primary, borderRadius: 12, padding: spacing.lg, alignItems: 'center', marginTop: spacing.xl},
  buttonText: {color: colors.surface, fontWeight: '800'},
});
