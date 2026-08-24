import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import ThemedText from './ThemedText';
import { borderRadius } from '@/design-system/spacing';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';
  size?: 'sm' | 'md';
}

export default function Badge({ label, variant = 'default', size = 'md' }: BadgeProps) {
  const theme = useTheme();

  const variantMap = {
    primary: { bg: theme.colors.primaryContainer, text: theme.colors.primary },
    secondary: { bg: theme.colors.secondaryContainer, text: theme.colors.secondary },
    success: { bg: '#D1FAE5', text: '#059669' },
    warning: { bg: '#FEF3C7', text: '#D97706' },
    error: { bg: theme.colors.errorContainer, text: theme.colors.error },
    default: { bg: theme.colors.surfaceVariant, text: theme.colors.onSurfaceVariant },
  };

  const { bg, text } = variantMap[variant];

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: size === 'sm' ? 6 : 10,
        paddingVertical: size === 'sm' ? 2 : 4,
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
      }}
    >
      <ThemedText variant={size === 'sm' ? 'caption' : 'caption'} style={{ color: text, fontWeight: '600', fontSize: size === 'sm' ? 10 : 12 }}>
        {label}
      </ThemedText>
    </View>
  );
}
