import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {useNetworkStatus} from '../hooks/useNetworkStatus';

export function OfflineBanner() {
  const {isOnline} = useNetworkStatus();
  if (isOnline) return null;
  return <View style={styles.banner}><Text style={styles.text}>Bạn đang offline</Text></View>;
}

const styles = StyleSheet.create({
  banner: {backgroundColor: colors.warning, paddingVertical: 8, alignItems: 'center'},
  text: {color: colors.surface, fontWeight: '700'},
});
