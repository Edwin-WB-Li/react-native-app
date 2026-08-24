import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ThemedTextProps extends TextProps {
  variant?: 'headline' | 'title' | 'body' | 'bodySmall' | 'caption' | 'label';
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'error';
  weight?: TextStyle['fontWeight'];
}

export default function ThemedText({
  variant = 'body',
  color = 'default',
  weight,
  style,
  ...props
}: ThemedTextProps) {
  const theme = useTheme();

  const colorMap = {
    default: theme.colors.onSurface,
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    muted: theme.colors.onSurfaceVariant,
    error: theme.colors.error,
  };

  const variantMap: Record<string, TextStyle> = {
    headline: { fontSize: 28, lineHeight: 36, letterSpacing: -0.5 },
    title: { fontSize: 20, lineHeight: 28, letterSpacing: -0.3 },
    body: { fontSize: 16, lineHeight: 24 },
    bodySmall: { fontSize: 14, lineHeight: 20 },
    caption: { fontSize: 12, lineHeight: 16 },
    label: { fontSize: 13, lineHeight: 18, letterSpacing: 0.3 },
  };

  return (
    <Text
      style={[
        { color: colorMap[color], fontWeight: weight },
        variantMap[variant],
        style,
      ]}
      {...props}
    />
  );
}
