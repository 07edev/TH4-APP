import React, {useMemo, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, TextInput} from 'react-native';
import {RootScreenProps} from '../navigation/navigationTypes';
import {useAppData} from '../context/AppDataContext';
import {useNetworkStatus} from '../hooks/useNetworkStatus';
import {sessionService} from '../api/sessionService';
import {enqueue} from '../storage/outbox';
import {ScreenContainer} from '../components/ScreenContainer';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

export function ScheduleFormScreen({route, navigation}: RootScreenProps<'ScheduleForm'>) {
  const {courses, sessions} = useAppData();
  const {isOnline} = useNetworkStatus();
  const [courseId, setCourseId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('09:30');
  const [room, setRoom] = useState('');
  const [note, setNote] = useState('');
  const selectedCourse = useMemo(() => courseId ?? courses.data?.[0]?.id ?? 1, [courseId, courses.data]);
  const selectedDay = new Date(`${route.params.date}T00:00:00`).getDay() || 7;

  const submit = async () => {
    if (!room.trim() || !startTime.trim() || !endTime.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập thời gian và phòng học.');
      return;
    }
    const body = {courseId: selectedCourse, date: route.params.date, dayOfWeek: selectedDay, startTime, endTime, room: room.trim(), note: note.trim()};
    try {
      if (isOnline) {
        await sessionService.create(body);
        await sessions.refresh();
      } else {
        await enqueue({id: `session-create-${Date.now()}`, method: 'POST', url: '/sessions', body, createdAt: new Date().toISOString()});
      }
      Alert.alert('Thành công', isOnline ? 'Đã thêm buổi học.' : 'Đã lưu và sẽ đồng bộ khi có mạng.');
      navigation.goBack();
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm buổi học.');
    }
  };

  return <ScreenContainer><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.date}>Ngày chọn: {route.params.date}</Text>
    <Text style={styles.label}>Môn học</Text>
    {(courses.data ?? []).map(course => <Pressable key={course.id} onPress={() => setCourseId(course.id)} style={[styles.course, selectedCourse === course.id && styles.selected]}><Text style={selectedCourse === course.id ? styles.selectedText : styles.text}>{course.code} - {course.name}</Text></Pressable>)}
    <Text style={styles.label}>Thời gian bắt đầu</Text><TextInput value={startTime} onChangeText={setStartTime} placeholder="07:00" style={styles.input} />
    <Text style={styles.label}>Thời gian kết thúc</Text><TextInput value={endTime} onChangeText={setEndTime} placeholder="09:30" style={styles.input} />
    <Text style={styles.label}>Phòng học</Text><TextInput value={room} onChangeText={setRoom} placeholder="P.301-A2" style={styles.input} />
    <Text style={styles.label}>Ghi chú</Text><TextInput value={note} onChangeText={setNote} placeholder="Ghi chú thêm..." style={styles.input} />
    <Pressable style={styles.button} onPress={() => void submit()}><Text style={styles.buttonText}>Lưu buổi học</Text></Pressable>
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: {padding: spacing.lg}, date: {fontSize: 18, fontWeight: '800', color: colors.primary},
  label: {fontWeight: '800', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm},
  input: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md, color: colors.text},
  course: {padding: spacing.md, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm, backgroundColor: colors.surface},
  selected: {backgroundColor: colors.primary, borderColor: colors.primary}, text: {color: colors.text}, selectedText: {color: colors.surface, fontWeight: '700'},
  button: {backgroundColor: colors.primary, borderRadius: 12, padding: spacing.lg, alignItems: 'center', marginTop: spacing.xl}, buttonText: {color: colors.surface, fontWeight: '800'},
});
