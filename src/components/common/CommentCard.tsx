import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import { Comment } from '#/models';
import ThemedText from '@/components/ui/ThemedText';
import { spacing, borderRadius } from '@/design-system/spacing';

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const theme = useTheme();
  const initial = comment.name.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.avatar,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <ThemedText variant="body" weight="700" color="primary">
          {initial}
        </ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="bodySmall" weight="600">
            {comment.name}
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            {comment.email}
          </ThemedText>
        </View>
        <ThemedText variant="bodySmall" style={styles.body}>
          {comment.body}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  body: {
    lineHeight: 20,
  },
});
