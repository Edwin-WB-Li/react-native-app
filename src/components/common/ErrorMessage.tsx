import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedText from '@/components/ui/ThemedText';
import { spacing, borderRadius } from '@/design-system/spacing';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.colors.errorContainer },
        ]}
      >
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={32}
          color={theme.colors.error}
        />
      </View>
      <ThemedText variant="title" weight="600" style={styles.title}>
        出错了
      </ThemedText>
      <ThemedText variant="bodySmall" color="muted" style={styles.message}>
        {message}
      </ThemedText>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: theme.colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <ThemedText
            variant="bodySmall"
            weight="600"
            style={{ color: '#FFFFFF' }}
          >
            重试
          </ThemedText>
        </Pressable>
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
});
