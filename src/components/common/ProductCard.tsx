import React, { memo, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation/AppNavigator';
import ThemedText from '@/components/ui/ThemedText';
import Badge from '@/components/ui/Badge';
import { spacing, borderRadius } from '@/design-system/spacing';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sales: number;
  tags?: string[];
  isFlashSale?: boolean;
  flashSalePrice?: number;
}

const BLURHASH = 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  sales,
  tags,
  isFlashSale,
  flashSalePrice,
}: ProductCardProps) {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    navigation.navigate('ProductDetail', { productId: id });
  }, [navigation, id]);

  const displayPrice = isFlashSale && flashSalePrice ? flashSalePrice : price;

  const formatSales = (s: number): string => {
    if (s >= 10000) return `${(s / 10000).toFixed(1)}万`;
    return s.toString();
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Image
        source={{ uri: image }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        placeholder={{ blurhash: BLURHASH }}
        cachePolicy="memory-disk"
      />
      <View style={styles.content}>
        <ThemedText variant="bodySmall" weight="600" numberOfLines={2} style={styles.name}>
          {name}
        </ThemedText>

        {tags && tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map(tag => (
              <Badge key={tag} label={tag} variant="primary" size="sm" />
            ))}
          </View>
        )}

        <View style={styles.priceRow}>
          <ThemedText variant="body" weight="700" color="error">
            ¥{displayPrice}
          </ThemedText>
          {originalPrice && originalPrice > displayPrice && (
            <ThemedText variant="caption" color="muted" style={styles.originalPrice}>
              ¥{originalPrice}
            </ThemedText>
          )}
        </View>

        <View style={styles.metaRow}>
          <ThemedText variant="caption" color="muted">
            {rating}分
          </ThemedText>
          <ThemedText variant="caption" color="muted">
            已售{formatSales(sales)}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    margin: spacing.xs,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  content: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  name: {
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default memo(ProductCard);
