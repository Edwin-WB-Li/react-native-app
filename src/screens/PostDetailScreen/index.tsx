import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { usePost } from '@/services/queries/usePosts';
import { useComments } from '@/services/queries/useComments';
import { RootStackParamList } from '@/navigation/AppNavigator';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import CommentCard from '@/components/common/CommentCard';
import ThemedText from '@/components/ui/ThemedText';
import Badge from '@/components/ui/Badge';
import { spacing, borderRadius } from '@/design-system/spacing';

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;

const BLURHASH = 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.';

function CommentsSection({ postId }: { postId: number }) {
  const theme = useTheme();
  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useComments(postId);

  if (isLoading) {
    return (
      <View style={[styles.commentsCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.commentsHeader}>
          <ThemedText variant="title" weight="700">
            评论
          </ThemedText>
        </View>
        <ActivityIndicator size="small" color={theme.colors.primary} style={styles.commentsLoading} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.commentsCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.commentsHeader}>
          <ThemedText variant="title" weight="700">
            评论
          </ThemedText>
        </View>
        <ThemedText variant="bodySmall" color="muted" style={styles.commentsError}>
          {error?.message || '加载评论失败'}
        </ThemedText>
      </View>
    );
  }

  const commentCount = comments?.length ?? 0;

  return (
    <View
      style={[
        styles.commentsCard,
        {
          backgroundColor: theme.colors.surface,
          boxShadow: theme.dark
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        },
      ]}
    >
      <View style={styles.commentsHeader}>
        <ThemedText variant="title" weight="700">
          评论
        </ThemedText>
        <Badge label={`${commentCount} 条`} variant="primary" />
      </View>

      {commentCount === 0 ? (
        <ThemedText variant="bodySmall" color="muted" style={styles.emptyComments}>
          暂无评论，来发表第一条评论吧
        </ThemedText>
      ) : (
        <View style={styles.commentsList}>
          {comments?.map((comment: import('#/models').Comment, index: number) => (
            <React.Fragment key={comment.id}>
              {index > 0 && (
                <View
                  style={[
                    styles.commentDivider,
                    { backgroundColor: theme.colors.outline },
                  ]}
                />
              )}
              <CommentCard comment={comment} />
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
}

export default function PostDetailScreen() {
  const route = useRoute<PostDetailRouteProp>();
  const { postId } = route.params;
  const { data: post, isLoading, isError, error, refetch } = usePost(postId);
  const theme = useTheme();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !post) {
    return <ErrorMessage message={error?.message || '加载失败'} onRetry={refetch} />;
  }

  const imageUrl = `https://picsum.photos/seed/${post.id}/800/400`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.heroImage}
        contentFit="cover"
        transition={400}
        placeholder={{ blurhash: BLURHASH }}
        cachePolicy="memory-disk"
      />
      <View
        style={[
          styles.contentCard,
          {
            backgroundColor: theme.colors.surface,
            boxShadow: theme.dark
              ? '0 -4px 20px rgba(0, 0, 0, 0.4)'
              : '0 -4px 20px rgba(0, 0, 0, 0.08)',
          },
        ]}
      >
        <View style={styles.badgeRow}>
          <Badge label={`文章 #${post.id}`} variant="primary" />
          <Badge label={`用户 ${post.userId}`} variant="default" />
        </View>

        <ThemedText variant="headline" weight="800">
          {post.title}
        </ThemedText>

        <View
          style={[
            styles.divider,
            { backgroundColor: theme.colors.outline },
          ]}
        />

        <ThemedText variant="body" style={styles.body}>
          {post.body}
        </ThemedText>

        <View
          style={[
            styles.divider,
            { backgroundColor: theme.colors.outline },
          ]}
        />

        <ThemedText variant="caption" color="muted" style={styles.meta}>
          发布于 {new Date(2024, 0, post.id % 30 + 1).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </ThemedText>
      </View>

      <CommentsSection postId={post.id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
    gap: spacing.lg,
  },
  heroImage: {
    width: '100%',
    height: 260,
  },
  contentCard: {
    marginTop: -spacing.xl,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius['2xl'],
    borderCurve: 'continuous',
    padding: spacing['2xl'],
    gap: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  body: {
    lineHeight: 26,
  },
  meta: {
    textAlign: 'right',
  },
  commentsCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius['2xl'],
    borderCurve: 'continuous',
    padding: spacing['2xl'],
    gap: spacing.md,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentsList: {
    gap: 0,
  },
  commentDivider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  commentsLoading: {
    marginVertical: spacing.lg,
  },
  commentsError: {
    marginVertical: spacing.lg,
    textAlign: 'center',
  },
  emptyComments: {
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
});
