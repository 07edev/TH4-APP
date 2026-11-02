import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {EmptyState} from '../components/EmptyState';
import {schedules} from '../data/schedules';
import {subjects} from '../data/subjects';
import {initialAssignments} from '../data/assignments';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {RootStackParamList} from '../navigation/navigationTypes';
import {useAppData} from '../context/AppDataContext';

type CalendarDay = {
  label: string;
  date: string;
  day: string;
  hasEvents: boolean;
};

function formatSelectedDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createCalendarDays(month: Date, scheduleEvents: Array<{date?: string; dayOfWeek: number}>, assignmentDates: string[]): CalendarDay[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const dayCount = new Date(year, monthIndex + 1, 0).getDate();
  const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return Array.from({length: dayCount}, (_, index) => {
    const date = new Date(year, monthIndex, index + 1);
    const dateKey = toDateKey(date);
    return {
      label: labels[date.getDay()],
      date: String(index + 1),
      day: dateKey,
      hasEvents:
        scheduleEvents.some(item => item.date ? item.date === dateKey : item.dayOfWeek === (date.getDay() || 7)) ||
        assignmentDates.some(item => item === dateKey),
    };
  });
}

function formatMonth(month: Date) {
  return `Tháng ${month.getMonth() + 1}/${month.getFullYear()}`;
}

export function ScheduleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {sessions: apiSessions, assignments: apiAssignments, courses} = useAppData();
  const today = new Date();
  const todayKey = toDateKey(today);
  const [refreshing, setRefreshing] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [courseFilter, setCourseFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState<'all' | 'schedule' | 'assignment'>('all');
  const scheduleEvents = apiSessions.data?.map(item => ({id: String(item.id), subjectId: String(item.courseId), dayOfWeek: item.dayOfWeek, startTime: item.startTime, endTime: item.endTime, room: item.room, note: item.note, date: item.date})) ?? schedules.map(item => ({...item, subjectId: item.subjectId, dayOfWeek: Number(item.dayOfWeek === 'CN' ? 7 : item.dayOfWeek.replace('T', '')), date: item.date}));
  const assignmentEvents = apiAssignments.data?.map(item => ({id: String(item.id), subjectId: String(item.courseId), title: item.title, description: item.description, dueDate: item.dueDate, status: item.status === 'done' ? 'completed' as const : 'pending' as const})) ?? initialAssignments;
  const calendarDays = useMemo(() => createCalendarDays(displayMonth, scheduleEvents, assignmentEvents.map(item => item.dueDate.slice(0, 10))), [displayMonth, scheduleEvents, assignmentEvents]);
  const selectedDay = calendarDays.find(item => item.day === selectedDate);

  const daySchedules = useMemo(
    () => scheduleEvents.filter(item => item.date ? item.date === selectedDate : item.dayOfWeek === ((new Date(`${selectedDate}T00:00:00`).getDay() || 7))),
    [selectedDate, scheduleEvents],
  );
  const dayAssignments = useMemo(
    () =>
      assignmentEvents.filter(
        item => item.dueDate.slice(0, 10) === selectedDate,
      ),
    [selectedDate, assignmentEvents],
  );
  const filteredSchedules = daySchedules.filter(item => {
    const subject = courses.data?.find(value => String(value.id) === item.subjectId) ?? subjects.find(value => value.id === item.subjectId);
    return (courseFilter === 'all' || item.subjectId === courseFilter) &&
      (roomFilter === 'all' || item.room === roomFilter) &&
      activityFilter !== 'assignment' &&
      `${subject?.name ?? ''} ${subject?.code ?? ''} ${item.room}`
      .toLowerCase()
      .includes(searchText.toLowerCase());
  });
  const filteredAssignments = dayAssignments.filter(item =>
    activityFilter !== 'schedule' && item.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const changeMonth = (offset: number) => {
    const nextMonth = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() + offset,
      1,
    );
    setDisplayMonth(nextMonth);
    setSelectedDate(toDateKey(nextMonth));
    setSearchText('');
  };

  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([apiSessions.refresh(), apiAssignments.refresh(), courses.refresh()]);
    setRefreshing(false);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable
          style={styles.headerIcon}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}>
          <Ionicons name="chevron-back" size={25} color={colors.surface} />
        </Pressable>
        <Text style={styles.headerTitle}>Thời khóa biểu</Text>
        <Pressable style={styles.headerIcon} onPress={() => setSearchVisible(value => !value)}>
          <Ionicons name="search-outline" size={25} color={colors.surface} />
        </Pressable>
      </View>

      <View style={styles.calendarPanel}>
        <View style={styles.monthRow}>
          <Pressable style={styles.monthButton} onPress={() => setFilterVisible(value => !value)}>
            <Ionicons name="funnel-outline" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.monthTitleRow}>
            <Pressable onPress={() => changeMonth(-1)}>
              <Ionicons name="chevron-back" size={21} color={colors.mutedText} />
            </Pressable>
            <Pressable onPress={() => {
              const current = new Date();
              setDisplayMonth(new Date(current.getFullYear(), current.getMonth(), 1));
              setSelectedDate(toDateKey(current));
            }}>
              <Text style={styles.monthTitle}>{formatMonth(displayMonth)}</Text>
            </Pressable>
            <Pressable onPress={() => changeMonth(1)}>
              <Ionicons name="chevron-forward" size={21} color={colors.mutedText} />
            </Pressable>
          </View>
          <Pressable
            style={styles.monthButton}
            onPress={() => {
              const current = new Date();
              setDisplayMonth(new Date(current.getFullYear(), current.getMonth(), 1));
              setSelectedDate(toDateKey(current));
            }}>
            <Ionicons name="search-outline" size={27} color={colors.text} />
          </Pressable>
        </View>

        {searchVisible && (
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={19} color={colors.mutedText} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Tìm môn học, phòng hoặc bài tập..."
              placeholderTextColor={colors.mutedText}
              style={styles.searchInput}
              autoFocus
            />
          </View>
        )}
        {filterVisible && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterTitle}>Lọc hoạt động</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {(['all', 'schedule', 'assignment'] as const).map(value => <Pressable key={value} onPress={() => setActivityFilter(value)} style={[styles.filterChip, activityFilter === value && styles.activeFilterChip]}><Text style={activityFilter === value ? styles.activeFilterText : styles.filterText}>{value === 'all' ? 'Tất cả' : value === 'schedule' ? 'Buổi học' : 'Bài tập'}</Text></Pressable>)}
            </ScrollView>
            <Text style={styles.filterTitle}>Môn học</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {[{id: 'all', name: 'Tất cả'}, ...(courses.data ?? []).map(course => ({id: String(course.id), name: course.code}))].map(item => <Pressable key={item.id} onPress={() => setCourseFilter(item.id)} style={[styles.filterChip, courseFilter === item.id && styles.activeFilterChip]}><Text style={courseFilter === item.id ? styles.activeFilterText : styles.filterText}>{item.name}</Text></Pressable>)}
            </ScrollView>
            <Text style={styles.filterTitle}>Phòng học</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {['all', ...Array.from(new Set(scheduleEvents.map(item => item.room)))].map(room => <Pressable key={room} onPress={() => setRoomFilter(room)} style={[styles.filterChip, roomFilter === room && styles.activeFilterChip]}><Text style={roomFilter === room ? styles.activeFilterText : styles.filterText}>{room === 'all' ? 'Tất cả' : room}</Text></Pressable>)}
            </ScrollView>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysRow}>
          {calendarDays.map(item => {
            const isSelected = item.day === selectedDate;
            return (
              <Pressable
                key={item.day}
                onPress={() => setSelectedDate(item.day)}
                style={styles.dayCell}>
                <Text style={styles.weekday}>{item.label}</Text>
                <View style={[styles.dateCircle, isSelected && styles.selectedDate]}>
                  <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                    {item.date}
                  </Text>
                  {item.hasEvents && (
                    <View style={styles.dots}>
                      <View style={[styles.dot, {backgroundColor: colors.secondary}]} />
                      <View style={[styles.dot, {backgroundColor: colors.primary}]} />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.dragHandle} />
      </View>

      <View style={styles.contentHeader}>
        <View>
          <Text style={styles.todayTitle}>
            {selectedDate === toDateKey(new Date()) ? 'Hôm nay, ' : ''}
            {formatSelectedDate(selectedDate)}
          </Text>
          <Text style={styles.eventCount}>
            {filteredSchedules.length + filteredAssignments.length} hoạt động trong ngày
          </Text>
        </View>
        <Pressable style={styles.addButton} onPress={() => navigation.navigate('ScheduleForm', {date: selectedDate})}>
          <Ionicons name="add" size={27} color={colors.surface} />
        </Pressable>
      </View>

      <FlatList
        data={[
          ...filteredSchedules.map(item => ({type: 'schedule' as const, item})),
          ...filteredAssignments.map(item => ({type: 'assignment' as const, item})),
        ]}
        keyExtractor={item => `${item.type}-${item.item.id}`}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refresh()} />}
        renderItem={({item}) => {
          if (item.type === 'schedule') {
            const subject = courses.data?.find(value => String(value.id) === item.item.subjectId) ?? subjects.find(value => value.id === item.item.subjectId);
            return (
              <Pressable
                style={[styles.eventCard, styles.classCard]}
                onPress={() =>
                  navigation.navigate('ScheduleDetail', {scheduleId: item.item.id})
                }>
                <View style={[styles.eventLine, {backgroundColor: colors.secondary}]} />
                <View style={styles.eventBody}>
                  <Text style={[styles.eventTitle, {color: colors.primaryDark}]}>
                    {subject?.name ?? 'Buổi học'}
                  </Text>
                  <Text style={styles.eventTime}>
                    {item.item.startTime} - {item.item.endTime}
                  </Text>
                  <Text style={styles.eventMeta}>
                    <Ionicons name="flag-outline" size={16} color={colors.primary} />{' '}
                    {item.item.room}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
              </Pressable>
            );
          }

          return (
            <Pressable
              style={[styles.eventCard, styles.assignmentCard]}
              onPress={() =>
                navigation.navigate('AssignmentDetail', {assignmentId: item.item.id})
              }>
              <View style={[styles.eventLine, {backgroundColor: colors.primary}]} />
              <View style={styles.eventBody}>
                <Text style={[styles.eventTitle, {color: colors.primaryDark}]}>
                  {item.item.title}
                </Text>
                <Text style={styles.eventTime}>
                  Hạn nộp: {new Date(item.item.dueDate).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} {formatSelectedDate(selectedDate)}
                </Text>
                <Text style={styles.eventMeta}>
                  <Ionicons name="flag-outline" size={16} color={colors.primary} />{' '}
                  Bài tập môn học
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <EmptyState message={`Không có lịch học vào ${selectedDay?.label ?? 'ngày này'}.`} />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 112,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {padding: 8},
  headerTitle: {color: colors.surface, fontSize: 25, fontWeight: '800'},
  calendarPanel: {
    backgroundColor: colors.surface,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  monthButton: {width: 40, alignItems: 'center'},
  monthTitleRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.lg},
  monthTitle: {color: colors.primaryDark, fontSize: 23, fontWeight: '800'},
  searchBox: {flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.lg, marginTop: spacing.md, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.background},
  searchInput: {flex: 1, color: colors.text, paddingVertical: 10, paddingHorizontal: spacing.sm},
  filterPanel: {marginHorizontal: spacing.lg, marginTop: spacing.md, padding: spacing.md, borderRadius: 14, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border},
  filterTitle: {fontWeight: '800', color: colors.text, marginBottom: spacing.sm, marginTop: spacing.sm},
  filterRow: {gap: spacing.sm},
  filterChip: {paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border},
  activeFilterChip: {backgroundColor: colors.primary, borderColor: colors.primary},
  filterText: {color: colors.mutedText},
  activeFilterText: {color: colors.surface, fontWeight: '700'},
  daysRow: {paddingHorizontal: spacing.md, paddingTop: spacing.lg, gap: spacing.sm},
  dayCell: {width: 52, alignItems: 'center'},
  weekday: {fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8},
  dateCircle: {width: 48, height: 62, alignItems: 'center', justifyContent: 'center', borderRadius: 25},
  selectedDate: {backgroundColor: colors.primary},
  dateText: {fontSize: 20, color: '#737373', fontWeight: '500'},
  selectedDateText: {color: colors.surface, fontWeight: '800'},
  dots: {flexDirection: 'row', gap: 3, position: 'absolute', bottom: 6},
  dot: {width: 6, height: 6, borderRadius: 3},
  dragHandle: {width: 78, height: 5, backgroundColor: '#B5B5B5', borderRadius: 4, alignSelf: 'center', marginTop: spacing.md},
  contentHeader: {paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  todayTitle: {fontSize: 25, fontWeight: '800', color: colors.text},
  eventCount: {fontSize: 13, color: colors.mutedText, marginTop: 5},
  addButton: {width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  list: {paddingHorizontal: spacing.lg, paddingBottom: spacing.xl},
  eventCard: {borderRadius: 14, marginBottom: spacing.md, padding: spacing.lg, paddingLeft: spacing.md, flexDirection: 'row', alignItems: 'center', minHeight: 115},
  classCard: {backgroundColor: '#E0F2FE'},
  assignmentCard: {backgroundColor: '#EFF6FF'},
  eventLine: {width: 6, alignSelf: 'stretch', borderRadius: 4, marginRight: spacing.lg},
  eventBody: {flex: 1},
  eventTitle: {fontSize: 18, fontWeight: '800', lineHeight: 25},
  eventTime: {fontSize: 16, color: colors.text, marginTop: 10},
  eventMeta: {fontSize: 16, color: colors.text, marginTop: 9},
});
