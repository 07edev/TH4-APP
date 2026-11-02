import React, {useMemo, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, TextInput, View} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {ScreenContainer} from '../components/ScreenContainer';
import {SubjectCard} from '../components/Cards';
import {EmptyState} from '../components/EmptyState';
import {subjects} from '../data/subjects';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/navigationTypes';
import {useAppData} from '../context/AppDataContext';
import {LoadingView} from '../components/LoadingView';
import {ErrorView} from '../components/ErrorView';
import {Subject} from '../types/models';

export function SubjectsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {courses} = useAppData();
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => { setRefreshing(true); await courses.refresh(); setRefreshing(false); };
  const courseList: Subject[] = courses.data?.map(item => ({id: String(item.id), code: item.code, name: item.name, credits: item.credits, lecturer: item.lecturer, room: '', semester: item.semester, description: item.description})) ?? subjects;
  const filtered = useMemo(() => courseList.filter(item => `${item.name} ${item.code}`.toLowerCase().includes(query.toLowerCase())), [courseList, query]);
  if (courses.loading && !courses.data) return <ScreenContainer><LoadingView /></ScreenContainer>;
  if (courses.error && !courses.data) return <ScreenContainer><ErrorView message={courses.error.message} onRetry={() => void courses.refresh()} /></ScreenContainer>;
  return <ScreenContainer><Text style={styles.heading}>Môn học</Text><Text style={styles.subtitle}>{filtered.length} môn học trong học kỳ hiện tại</Text><View style={styles.search}><Ionicons name="search-outline" size={20} color={colors.mutedText} /><TextInput value={query} onChangeText={setQuery} placeholder="Tìm theo tên hoặc mã môn..." style={styles.input} /></View>
    <FlatList data={filtered} contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refresh()} />} keyExtractor={item => item.id} renderItem={({item}) => <SubjectCard subject={item} onPress={() => navigation.navigate('SubjectDetail', {subjectId: item.id})} />} ListEmptyComponent={<EmptyState message="Không tìm thấy môn học phù hợp." />} />
  </ScreenContainer>;
}
const styles = StyleSheet.create({heading: {fontSize: 26, fontWeight: '800', color: colors.text, paddingHorizontal: spacing.lg, paddingTop: spacing.lg}, subtitle: {color: colors.mutedText, marginHorizontal: spacing.lg, marginTop: 5, marginBottom: spacing.lg}, search: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, marginHorizontal: spacing.lg, paddingHorizontal: spacing.md}, input: {flex: 1, paddingVertical: 12, paddingHorizontal: spacing.sm, color: colors.text}, list: {padding: spacing.lg}});
