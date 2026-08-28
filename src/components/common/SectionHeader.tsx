import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

import ThemedText from '@/components/ui/ThemedText';
import { spacing } from '@/design-system/spacing';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function SectionHeader({ title, subtitle, onPress }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.left}>
        <ThemedText variant="title" weight="700">
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText variant="bodySmall" color="muted">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {onPress ? <View style={styles.right}>
          <ThemedText variant="caption" color="primary">
            更多
          </ThemedText>
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
            color={theme.colors.primary}
          />
        </View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  left: {
    gap: spacing.xs,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
