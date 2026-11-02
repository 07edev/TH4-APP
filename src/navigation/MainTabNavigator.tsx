import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TabParamList} from './navigationTypes';
import {OverviewScreen} from '../screens/OverviewScreen';
import {SubjectsScreen} from '../screens/SubjectsScreen';
import {ScheduleScreen} from '../screens/ScheduleScreen';
import {AssignmentsScreen} from '../screens/AssignmentsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {SubjectDetailScreen} from '../screens/SubjectDetailScreen';
import {ScheduleDetailScreen} from '../screens/ScheduleDetailScreen';
import {ScheduleFormScreen} from '../screens/ScheduleFormScreen';
import {AssignmentDetailScreen} from '../screens/AssignmentDetailScreen';
import {AssignmentFormScreen} from '../screens/AssignmentFormScreen';
import {AcademicResultDetailScreen} from '../screens/AcademicResultDetailScreen';
import {EditProfileScreen} from '../screens/EditProfileScreen';
import {colors} from '../theme/colors';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useSync} from '../context/SyncContext';
import {RootStackParamList} from './navigationTypes';

const Tab = createBottomTabNavigator<TabParamList>();
const OverviewStack = createNativeStackNavigator<RootStackParamList>();
const SubjectsStack = createNativeStackNavigator<RootStackParamList>();
const ScheduleStack = createNativeStackNavigator<RootStackParamList>();
const AssignmentsStack = createNativeStackNavigator<RootStackParamList>();
const ProfileStack = createNativeStackNavigator<RootStackParamList>();

const stackOptions = {headerShown: false};
type TabIconProps = {color: string; size: number};
const OverviewIcon = ({color, size}: TabIconProps) => <Ionicons name="grid-outline" color={color} size={size} />;
const SubjectsIcon = ({color, size}: TabIconProps) => <Ionicons name="book-outline" color={color} size={size} />;
const ScheduleIcon = ({color, size}: TabIconProps) => <Ionicons name="calendar-outline" color={color} size={size} />;
const AssignmentsIcon = ({color, size}: TabIconProps) => <Ionicons name="checkbox-outline" color={color} size={size} />;
const ProfileIcon = ({color, size}: TabIconProps) => <Ionicons name="person-outline" color={color} size={size} />;

function OverviewNavigator() {
  return <OverviewStack.Navigator screenOptions={stackOptions}><OverviewStack.Screen name="MainTabs" component={OverviewScreen} /><OverviewStack.Screen name="SubjectDetail" component={SubjectDetailScreen} options={{headerShown: true, title: 'Chi tiết môn học'}} /><OverviewStack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} options={{headerShown: true, title: 'Chi tiết bài tập'}} /></OverviewStack.Navigator>;
}
function SubjectsNavigator() {
  return <SubjectsStack.Navigator screenOptions={stackOptions}><SubjectsStack.Screen name="MainTabs" component={SubjectsScreen} /><SubjectsStack.Screen name="SubjectDetail" component={SubjectDetailScreen} options={{headerShown: true, title: 'Chi tiết môn học'}} /></SubjectsStack.Navigator>;
}
function ScheduleNavigator() {
  return <ScheduleStack.Navigator screenOptions={stackOptions}><ScheduleStack.Screen name="MainTabs" component={ScheduleScreen} /><ScheduleStack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} options={{headerShown: true, title: 'Chi tiết buổi học'}} /><ScheduleStack.Screen name="ScheduleForm" component={ScheduleFormScreen} options={{headerShown: true, title: 'Thêm buổi học'}} /><ScheduleStack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} options={{headerShown: true, title: 'Chi tiết bài tập'}} /></ScheduleStack.Navigator>;
}
function AssignmentsNavigator() {
  return <AssignmentsStack.Navigator screenOptions={stackOptions}><AssignmentsStack.Screen name="MainTabs" component={AssignmentsScreen} /><AssignmentsStack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} options={{headerShown: true, title: 'Chi tiết bài tập'}} /><AssignmentsStack.Screen name="AssignmentForm" component={AssignmentFormScreen} options={{headerShown: true, title: 'Thêm bài tập'}} /></AssignmentsStack.Navigator>;
}
function ProfileNavigator() {
  return <ProfileStack.Navigator screenOptions={stackOptions}><ProfileStack.Screen name="MainTabs" component={ProfileScreen} /><ProfileStack.Screen name="AcademicResultDetail" component={AcademicResultDetailScreen} options={{headerShown: true, title: 'Chi tiết kết quả'}} /><ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{headerShown: true, title: 'Chỉnh sửa cá nhân'}} /></ProfileStack.Navigator>;
}

export function MainTabNavigator() {
  const {pendingCount} = useSync();
  return <Tab.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.tabInactive, tabBarStyle: {height: 66, paddingTop: 7, paddingBottom: 8, borderTopColor: colors.border, backgroundColor: colors.surface}, tabBarLabelStyle: {fontSize: 11, fontWeight: '600'}}}>
    <Tab.Screen name="Overview" component={OverviewNavigator} options={{title: 'Tổng quan', tabBarLabel: 'Tổng quan', tabBarIcon: OverviewIcon}} />
    <Tab.Screen name="Subjects" component={SubjectsNavigator} options={{title: 'Môn học', tabBarLabel: 'Môn học', tabBarIcon: SubjectsIcon}} />
    <Tab.Screen name="Schedule" component={ScheduleNavigator} options={{title: 'Lịch học', tabBarLabel: 'Lịch học', tabBarIcon: ScheduleIcon}} />
    <Tab.Screen name="Assignments" component={AssignmentsNavigator} options={{title: 'Bài tập', tabBarLabel: 'Bài tập', tabBarBadge: pendingCount || undefined, tabBarIcon: AssignmentsIcon}} />
    <Tab.Screen name="Profile" component={ProfileNavigator} options={{title: 'Cá nhân', tabBarLabel: 'Cá nhân', tabBarIcon: ProfileIcon}} />
  </Tab.Navigator>;
}
