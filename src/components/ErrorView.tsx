import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';

export function ErrorView({message, onRetry}: {message: string; onRetry: () => void}) {
  return <View style={styles.container}><Text style={styles.title}>Đã có lỗi xảy ra</Text><Text style={styles.message}>{message}</Text><Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}><Text style={styles.buttonText}>Thử lại</Text></Pressable></View>;
}

const styles = StyleSheet.create({container: {alignItems: 'center', justifyContent: 'center', padding: 32}, title: {fontSize: 18, fontWeight: '800', color: colors.text}, message: {color: colors.mutedText, textAlign: 'center', marginTop: 8}, button: {backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 11, marginTop: 16}, buttonText: {color: colors.surface, fontWeight: '700'}});
