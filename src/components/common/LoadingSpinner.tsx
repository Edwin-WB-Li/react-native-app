import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import ThemedText from '@/components/ui/ThemedText';
import { spacing } from '@/design-system/spacing';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = '加载中...' }: LoadingSpinnerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.spinnerWrapper}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
      {message ? (
        <ThemedText variant="bodySmall" color="muted" style={styles.text}>
          {message}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
    gap: spacing.md,
  },
  spinnerWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: spacing.xs,
  },
});
