import React, { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation/AppNavigator';
import { truncateString } from '@/utils/helpers';
import Card from '@/components/ui/Card';
import ThemedText from '@/components/ui/ThemedText';
import Badge from '@/components/ui/Badge';
import { spacing } from '@/design-system/spacing';

interface PostCardProps {
  id: number;
  title: string;
  body: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BLURHASH = 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.';

function PostCard({ id, title, body }: PostCardProps) {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    navigation.navigate('PostDetail', { postId: id });
  }, [navigation, id]);

  const imageUrl = `https://picsum.photos/seed/${id}/400/200`;

  return (
    <Card onPress={handlePress} pressable style={styles.cardWrapper}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        placeholder={{ blurhash: BLURHASH }}
        cachePolicy="memory-disk"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Badge label={`#${id}`} variant="primary" />
        </View>
        <ThemedText variant="title" weight="700" numberOfLines={2}>
          {truncateString(title, 60)}
        </ThemedText>
        <ThemedText variant="bodySmall" color="muted" numberOfLines={2}>
          {truncateString(body, 120)}
        </ThemedText>
        <View style={styles.footer}>
          <ThemedText variant="caption" color="muted">
            用户 {id % 10 + 1}
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            {new Date(2024, 0, id % 30 + 1).toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric',
            })}
          </ThemedText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});

export default memo(PostCard);
