import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'surface' | 'surfaceVariant';
}

export default function ThemedView({ variant = 'default', style, ...props }: ThemedViewProps) {
  const theme = useTheme();

  const backgroundColor =
    variant === 'surface'
      ? theme.colors.surface
      : variant === 'surfaceVariant'
        ? theme.colors.surfaceVariant
        : theme.colors.background;

  return <View style={[{ backgroundColor }, style]} {...props} />;
}
