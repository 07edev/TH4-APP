import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './navigationTypes';
import {MainTabNavigator} from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{headerShown: false}} />
    </Stack.Navigator>
  </NavigationContainer>;
}
