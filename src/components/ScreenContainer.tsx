import React, {PropsWithChildren} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {OfflineBanner} from './OfflineBanner';

export function ScreenContainer({children}: PropsWithChildren) {
  return <SafeAreaView style={styles.container}><OfflineBanner />{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
});
