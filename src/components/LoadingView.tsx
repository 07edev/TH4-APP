import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';

export function LoadingView({message = 'Đang tải...'}: {message?: string}) {
  return <View style={styles.container}><ActivityIndicator color={colors.primary} size="large" /><Text style={styles.text}>{message}</Text></View>;
}

const styles = StyleSheet.create({container: {alignItems: 'center', justifyContent: 'center', padding: 32}, text: {color: colors.mutedText, marginTop: 10}});
