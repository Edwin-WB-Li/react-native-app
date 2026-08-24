import React from 'react';
import { FlatList, StyleSheet, RefreshControl, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

import { usePosts } from '@/services/queries/usePosts';
import PostCard from '@/components/common/PostCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import ThemedText from '@/components/ui/ThemedText';
import { Post } from '@/models';
import { spacing } from '@/design-system/spacing';

const renderItem: ListRenderItem<Post> = ({ item }) => (
  <PostCard id={item.id} title={item.title} body={item.body} />
);

const keyExtractor = (item: Post) => item.id.toString();

function ListHeader() {
  const theme = useTheme();

  return (
    <View style={styles.headerContainer}>
      <ThemedText variant="headline" weight="800">
        探索
      </ThemedText>
      <ThemedText variant="body" color="muted">
        发现精彩内容，浏览最新文章
      </ThemedText>
      <View
        style={[
          styles.divider,
          { backgroundColor: theme.colors.outline },
        ]}
      />
    </View>
  );
}

import { View } from 'react-native';

export default function HomeScreen() {
  const { data: posts, isLoading, isError, error, refetch, isRefetching } = usePosts();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message || '加载失败'} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  divider: {
    height: 1,
    marginTop: spacing.md,
  },
  listContent: {
    paddingBottom: spacing['3xl'],
  },
});
