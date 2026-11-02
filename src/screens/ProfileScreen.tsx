import React, {useCallback, useState} from 'react';
import {FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {ScreenContainer} from '../components/ScreenContainer';
import {LoadingView} from '../components/LoadingView';
import {ErrorView} from '../components/ErrorView';
import {initialStudent} from '../data/student';
import {Student} from '../types/models';
import {loadStudent} from '../services/storage';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {RootStackParamList} from '../navigation/navigationTypes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppData} from '../context/AppDataContext';
import {calcGpa} from '../utils/gpa';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {student: studentQuery, grades, courses} = useAppData();
  const [student, setStudent] = useState<Student>(initialStudent);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => {
    let active = true;
    loadStudent(initialStudent).then(value => {
      if (active) setStudent(value);
    }).catch(() => {
      if (active) setStudent(initialStudent);
    });
    return () => { active = false; };
  }, []));

  if (studentQuery.loading && !studentQuery.data) return <ScreenContainer><LoadingView /></ScreenContainer>;
  if (studentQuery.error && !studentQuery.data) return <ScreenContainer><ErrorView message={studentQuery.error.message} onRetry={() => void studentQuery.refresh()} /></ScreenContainer>;

  const apiStudent = studentQuery.data;
  const gradeItems = grades.data ?? [];
  const semesters = ['all', ...Array.from(new Set(gradeItems.map(item => item.semester)))];
  const visibleGrades = selectedSemester === 'all' ? gradeItems : gradeItems.filter(item => item.semester === selectedSemester);
  const gpa = calcGpa(gradeItems, courses.data ?? []);
  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([studentQuery.refresh(), grades.refresh(), courses.refresh()]);
    setRefreshing(false);
  };

  return <ScreenContainer><FlatList
    data={visibleGrades}
    keyExtractor={item => String(item.id)}
    contentContainerStyle={styles.content}
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refresh()} />}
    ListHeaderComponent={<>
      <Text style={styles.heading}>Cá nhân</Text>
      <View style={styles.profile}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{(apiStudent?.fullName ?? student.fullName).charAt(0)}</Text></View>
        <Text style={styles.name}>{apiStudent?.fullName ?? student.fullName}</Text>
        <Text style={styles.code}>{apiStudent?.studentCode ?? student.studentCode}</Text>
        <Text style={styles.muted}>{apiStudent?.className ?? student.className} · {apiStudent?.major ?? student.major}</Text>
        <View style={styles.contact}>
          <Text style={styles.info}><Ionicons name="mail-outline" size={15} color={colors.primary} />  {apiStudent?.email ?? student.email}</Text>
          <Text style={styles.info}><Ionicons name="call-outline" size={15} color={colors.primary} />  {apiStudent?.phone ?? student.phone}</Text>
        </View>
        <View style={styles.gpaRow}><Text style={styles.gpa}>GPA {gpa.gpa.toFixed(2)}</Text><Text style={styles.muted}>Tín chỉ tích lũy: {gpa.totalCredits}</Text></View>
        <Pressable style={styles.button} onPress={() => navigation.navigate('EditProfile')}><Ionicons name="create-outline" size={17} color={colors.surface} /><Text style={styles.buttonText}>  Chỉnh sửa thông tin</Text></Pressable>
      </View>
      <Text style={styles.section}>Kết quả học tập</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.semesters}>
        {semesters.map(semester => <Pressable key={semester} onPress={() => setSelectedSemester(semester)} style={[styles.semester, selectedSemester === semester && styles.selectedSemester]}>
          <Text style={selectedSemester === semester ? styles.selectedSemesterText : styles.semesterText}>{semester === 'all' ? 'Tất cả' : semester}</Text>
        </Pressable>)}
      </ScrollView>
    </>}
    renderItem={({item}) => <Pressable style={styles.result} onPress={() => navigation.navigate('AcademicResultDetail', {resultId: String(item.id)})}>
      <View style={styles.resultIcon}><Ionicons name="ribbon-outline" size={20} color={colors.primary} /></View>
      <View style={styles.resultBody}><Text style={styles.resultName}>{item.course?.name ?? courses.data?.find(course => course.id === item.courseId)?.name}</Text><Text style={styles.muted}>{item.semester} · Điểm {item.total} ({item.letter})</Text></View>
      <Ionicons name="chevron-forward" size={20} color={colors.tabInactive} />
    </Pressable>}
    ListEmptyComponent={<Text style={styles.muted}>Chưa có kết quả học tập.</Text>}
  /></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: {padding: spacing.lg},
  heading: {fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: spacing.lg},
  profile: {backgroundColor: colors.surface, padding: spacing.xl, borderRadius: 18, borderWidth: 1, borderColor: colors.border, alignItems: 'center'},
  avatar: {width: 72, height: 72, borderRadius: 36, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center'},
  avatarText: {color: colors.primary, fontSize: 28, fontWeight: '800'},
  name: {fontSize: 21, color: colors.text, fontWeight: '800', marginTop: spacing.md},
  code: {color: colors.primary, fontWeight: '700', marginTop: 5},
  muted: {color: colors.mutedText, marginTop: 6, textAlign: 'center'},
  contact: {width: '100%', marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm},
  info: {color: colors.text, marginTop: spacing.sm},
  gpaRow: {width: '100%', alignItems: 'center', backgroundColor: '#EFF6FF', borderRadius: 12, padding: spacing.md, marginTop: spacing.lg},
  gpa: {fontSize: 20, fontWeight: '800', color: colors.primary},
  button: {backgroundColor: colors.primary, padding: spacing.md, borderRadius: 10, marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center'},
  buttonText: {color: colors.surface, fontWeight: '700'},
  section: {fontSize: 18, fontWeight: '800', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md},
  semesters: {gap: spacing.sm, paddingBottom: spacing.md},
  semester: {borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.surface},
  selectedSemester: {backgroundColor: colors.primary, borderColor: colors.primary},
  semesterText: {color: colors.mutedText},
  selectedSemesterText: {color: colors.surface, fontWeight: '700'},
  result: {backgroundColor: colors.surface, borderRadius: 14, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center'},
  resultIcon: {width: 40, height: 40, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md},
  resultBody: {flex: 1},
  resultName: {fontWeight: '700', color: colors.text},
});
