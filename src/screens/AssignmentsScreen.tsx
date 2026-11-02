import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {ScreenContainer} from '../components/ScreenContainer';
import {AssignmentCard} from '../components/Cards';
import {EmptyState} from '../components/EmptyState';
import {initialAssignments} from '../data/assignments';
import {subjects} from '../data/subjects';
import {Assignment, AssignmentStatus} from '../types/models';
import {loadAssignments, saveAssignments} from '../services/storage';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/navigationTypes';
import {useAppData} from '../context/AppDataContext';
import {assignmentService} from '../api/assignmentService';
import {enqueue} from '../storage/outbox';
import {useNetworkStatus} from '../hooks/useNetworkStatus';
import {ApiAssignment} from '../types/apiModels';

export function AssignmentsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {assignments: apiAssignments, courses} = useAppData();
  const {isOnline} = useNetworkStatus();
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [filter, setFilter] = useState<'all' | AssignmentStatus>('all');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => { setRefreshing(true); await apiAssignments.refresh(); setRefreshing(false); };
  useEffect(() => { loadAssignments(initialAssignments).then(setAssignments).catch(() => setAssignments(initialAssignments)); }, []);
  useEffect(() => {
    if (!apiAssignments.data) return;
    setAssignments(apiAssignments.data.map((item: ApiAssignment) => ({
      id: String(item.id),
      subjectId: String(item.courseId),
      title: item.title,
      description: item.description,
      dueDate: item.dueDate,
      status: item.status === 'done' ? 'completed' : 'pending',
    })));
  }, [apiAssignments.data]);
  const filtered = useMemo(() => assignments.filter(item => (filter === 'all' || item.status === filter) && item.title.toLowerCase().includes(query.toLowerCase())), [assignments, filter, query]);
  const getSubject = (subjectId: string) => {
    const course = courses.data?.find(item => String(item.id) === subjectId);
    return course ? {
      id: subjectId,
      code: course.code,
      name: course.name,
      credits: course.credits,
      lecturer: course.lecturer,
      room: '',
      semester: course.semester,
      description: course.description,
    } : subjects.find(subject => subject.id === subjectId);
  };
  const toggle = (id: string) => {
    const current = assignments.find(item => item.id === id);
    if (!current) return;
    const status: AssignmentStatus = current.status === 'completed' ? 'pending' : 'completed';
    const next = assignments.map(item => item.id === id ? {...item, status} : item);
    setAssignments(next);
    saveAssignments(next).catch(() => undefined);
    const body: Partial<ApiAssignment> = {status: status === 'completed' ? 'done' : 'todo', updatedAt: new Date().toISOString()};
    if (!isOnline) {
      void enqueue({id: `assignment-${id}-${Date.now()}`, method: 'PATCH', url: `/assignments/${id}`, body, createdAt: new Date().toISOString()});
      return;
    }
    assignmentService.update(Number(id), body).then(() => apiAssignments.refresh()).catch(() => {
      setAssignments(assignments);
    });
  };
  return <ScreenContainer><ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refresh()} />} showsVerticalScrollIndicator={false}><View style={styles.titleRow}><View><Text style={styles.heading}>Bài tập</Text><Text style={styles.subtitle}>{filtered.length} bài tập được tìm thấy</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Thêm bài tập" style={styles.addButton} onPress={() => navigation.navigate('AssignmentForm')}><Ionicons name="add" size={25} color={colors.surface} /></Pressable></View><View style={styles.search}><Ionicons name="search-outline" size={20} color={colors.mutedText} /><TextInput value={query} onChangeText={setQuery} placeholder="Tìm bài tập..." style={styles.input} /></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}><Pressable onPress={() => setFilter('all')} style={[styles.filter, filter === 'all' && styles.active]}><Text style={filter === 'all' ? styles.activeText : styles.filterText}>Tất cả</Text></Pressable><Pressable onPress={() => setFilter('pending')} style={[styles.filter, filter === 'pending' && styles.active]}><Text style={filter === 'pending' ? styles.activeText : styles.filterText}>Chưa hoàn thành</Text></Pressable><Pressable onPress={() => setFilter('completed')} style={[styles.filter, filter === 'completed' && styles.active]}><Text style={filter === 'completed' ? styles.activeText : styles.filterText}>Đã hoàn thành</Text></Pressable></ScrollView><View style={styles.list}>{filtered.length > 0 ? filtered.map(item => <AssignmentCard key={item.id} assignment={item} subject={getSubject(item.subjectId)} onPress={() => navigation.navigate('AssignmentDetail', {assignmentId: item.id})} onToggle={() => toggle(item.id)} />) : <EmptyState message="Không có bài tập phù hợp." />}</View></ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({content: {paddingBottom: spacing.xl}, titleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, heading: {fontSize: 26, fontWeight: '800', color: colors.text, paddingHorizontal: spacing.lg, paddingTop: spacing.lg}, subtitle: {color: colors.mutedText, marginHorizontal: spacing.lg, marginTop: 5, marginBottom: spacing.lg}, addButton: {width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.lg}, search: {height: 64, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, marginHorizontal: spacing.lg, paddingHorizontal: spacing.md}, input: {flex: 1, paddingVertical: 12, paddingHorizontal: spacing.sm, color: colors.text, fontSize: 16}, filters: {paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, gap: spacing.sm, alignItems: 'flex-start'}, filter: {height: 44, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border}, active: {backgroundColor: colors.primary, borderColor: colors.primary}, filterText: {color: colors.mutedText, fontSize: 15}, activeText: {color: colors.surface, fontWeight: '700', fontSize: 15}, list: {paddingHorizontal: spacing.lg}});
