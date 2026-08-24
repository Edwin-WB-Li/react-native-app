import React, { memo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation/AppNavigator';
import ThemedText from '@/components/ui/ThemedText';
import { spacing, borderRadius } from '@/design-system/spacing';
import { Product } from '#/models';

interface FlashSaleSectionProps {
  products: Product[];
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function FlashSaleItem({ product }: { product: Product }) {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    navigation.navigate('ProductDetail', { productId: product.id });
  }, [navigation, product.id]);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - (product.flashSalePrice || product.price)) /
          product.originalPrice) *
          100
      )
    : 0;

  return (
    <Pressable onPress={handlePress} style={styles.itemContainer}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        cachePolicy="memory-disk"
      />
      <View style={styles.content}>
        <ThemedText variant="bodySmall" weight="600" numberOfLines={1}>
          {product.name}
        </ThemedText>
        <View style={styles.priceRow}>
          <ThemedText variant="body" weight="700" color="error">
            ¥{product.flashSalePrice || product.price}
          </ThemedText>
          {product.originalPrice && (
            <ThemedText variant="caption" color="muted" style={styles.originalPrice}>
              ¥{product.originalPrice}
            </ThemedText>
          )}
        </View>
        {discount > 0 && (
          <View
            style={[
              styles.discountBadge,
              { backgroundColor: theme.colors.errorContainer },
            ]}
          >
            <ThemedText
              variant="caption"
              style={{ color: theme.colors.error, fontWeight: '700' }}
            >
              {discount}%OFF
            </ThemedText>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function FlashSaleSection({ products }: FlashSaleSectionProps) {
  const theme = useTheme();

  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => <FlashSaleItem product={item} />,
    []
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ThemedText variant="title" weight="700">
            限时秒杀
          </ThemedText>
          <View
            style={[
              styles.tag,
              { backgroundColor: theme.colors.errorContainer },
            ]}
          >
            <ThemedText
              variant="caption"
              style={{ color: theme.colors.error, fontWeight: '700' }}
            >
              热销中
            </ThemedText>
          </View>
        </View>
        <ThemedText variant="bodySmall" color="muted">
          超值特惠，限时抢购
        </ThemedText>
      </View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  itemContainer: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
});

export default memo(FlashSaleSection);
