import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useProduct } from '@/services/queries/useProducts';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import ThemedText from '@/components/ui/ThemedText';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { spacing, borderRadius } from '@/design-system/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { productId } = route.params as { productId: number };

  const { data: product, isLoading, isError, error, refetch } = useProduct(productId);
  const { addItem, getTotalCount } = useCartStore();
  const cartTotalCount = getTotalCount();
  const { isAuthenticated } = useAuthStore();

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleAddToCart = useCallback(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    if (!product) return;
    addItem(product.id, 1);
    setSnackbarVisible(true);
  }, [isAuthenticated, product, addItem, navigation]);

  const handleBuyNow = useCallback(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    if (!product) return;
    addItem(product.id, 1);
    navigation.navigate('MainTabs', { screen: 'Cart' } as never);
  }, [isAuthenticated, product, addItem, navigation]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !product) {
    return (
      <ErrorMessage
        message={error?.message || '商品不存在'}
        onRetry={refetch}
      />
    );
  }

  const displayPrice = product.isFlashSale && product.flashSalePrice
    ? product.flashSalePrice
    : product.price;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 商品图片 */}
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
        />

        {/* 价格区域 */}
        <View style={[styles.priceSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.priceRow}>
            <ThemedText variant="headline" weight="700" color="error">
              ¥{displayPrice}
            </ThemedText>
            {product.originalPrice && product.originalPrice > displayPrice ? <ThemedText variant="body" color="muted" style={styles.originalPrice}>
                ¥{product.originalPrice}
              </ThemedText> : null}
          </View>
          {product.tags && product.tags.length > 0 ? <View style={styles.tagsRow}>
              {product.tags.map((tag: string) => (
                <Badge key={tag} label={tag} variant="primary" size="sm" />
              ))}
            </View> : null}
        </View>

        {/* 商品信息 */}
        <View style={[styles.infoSection, { backgroundColor: theme.colors.surface }]}>
          <ThemedText variant="title" weight="700">
            {product.name}
          </ThemedText>
          <ThemedText variant="body" color="muted" style={styles.description}>
            {product.description}
          </ThemedText>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
              <ThemedText variant="bodySmall">{product.rating}分</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="shopping" size={16} color={theme.colors.primary} />
              <ThemedText variant="bodySmall">已售{product.sales}</ThemedText>
            </View>
          </View>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
        <Pressable style={styles.iconButton} onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' } as never)}>
          <View style={styles.cartIconWrapper}>
            <MaterialCommunityIcons name="cart-outline" size={24} color={theme.colors.onSurface} />
            {isAuthenticated && cartTotalCount > 0 ? <View style={styles.cartBadge}>
                <ThemedText variant="caption" style={styles.cartBadgeText}>
                  {cartTotalCount > 99 ? '99+' : cartTotalCount}
                </ThemedText>
              </View> : null}
          </View>
          <ThemedText variant="caption">购物车</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.colors.secondaryContainer }]}
          onPress={handleAddToCart}
        >
          <ThemedText variant="body" weight="600" color="primary">
            {isAuthenticated ? '加入购物车' : '登录后加入'}
          </ThemedText>
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleBuyNow}
        >
          <ThemedText variant="body" weight="600" style={{ color: '#fff' }}>
            {isAuthenticated ? '立即购买' : '登录后购买'}
          </ThemedText>
        </Pressable>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{
          label: '去购物车',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' } as never),
        }}
        style={{ backgroundColor: theme.colors.inverseSurface }}
      >
        已成功加入购物车
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  priceSection: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  infoSection: {
    marginTop: spacing.sm,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  description: {
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  bottomPadding: {
    height: spacing['3xl'],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  iconButton: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  cartIconWrapper: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
});
