import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCartStore } from '@/stores/useCartStore';
import { useProducts } from '@/services/queries/useProducts';
import { useAuthStore } from '@/stores/useAuthStore';
import ThemedText from '@/components/ui/ThemedText';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { spacing, borderRadius } from '@/design-system/spacing';
import { CartItem } from '#/models';

interface CartItemRowProps {
  item: CartItem;
  product?: { name: string; price: number; image: string };
}

function CartItemRow({ item, product }: CartItemRowProps) {
  const theme = useTheme();
  const { toggleSelect, updateQuantity, removeItem } = useCartStore();

  if (!product) return null;

  return (
    <View
      style={[
        styles.cartItem,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      {/* 选择框 */}
      <Pressable onPress={() => toggleSelect(item.productId)} style={styles.checkbox}>
        <MaterialCommunityIcons
          name={item.selected ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={22}
          color={item.selected ? theme.colors.primary : theme.colors.onSurfaceVariant}
        />
      </Pressable>

      {/* 商品图片 */}
      <Image
        source={{ uri: product.image }}
        style={styles.itemImage}
        contentFit="cover"
        cachePolicy="memory-disk"
      />

      {/* 商品信息 */}
      <View style={styles.itemInfo}>
        <ThemedText variant="bodySmall" weight="600" numberOfLines={2}>
          {product.name}
        </ThemedText>
        <ThemedText variant="body" weight="700" color="error">
          ¥{product.price}
        </ThemedText>

        {/* 数量控制 */}
        <View style={styles.quantityControl}>
          <Pressable
            onPress={() => updateQuantity(item.productId, item.quantity - 1)}
            style={styles.quantityButton}
          >
            <MaterialCommunityIcons name="minus" size={16} color={theme.colors.onSurface} />
          </Pressable>
          <ThemedText variant="bodySmall" style={styles.quantityText}>
            {item.quantity}
          </ThemedText>
          <Pressable
            onPress={() => updateQuantity(item.productId, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <MaterialCommunityIcons name="plus" size={16} color={theme.colors.onSurface} />
          </Pressable>
        </View>
      </View>

      {/* 删除按钮 */}
      <Pressable onPress={() => removeItem(item.productId)} style={styles.deleteButton}>
        <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.error} />
      </Pressable>
    </View>
  );
}

export default function CartScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, toggleSelectAll, isAllSelected, getSelectedCount, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { data: products, isLoading } = useProducts();

  const getProduct = useCallback(
    (productId: number) => products?.find((p: { id: number }) => p.id === productId),
    [products]
  );

  const selectedCount = getSelectedCount();
  const allSelected = isAllSelected();

  const selectedTotal = items
    .filter(item => item.selected)
    .reduce((sum, item) => {
      const product = getProduct(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

  const renderItem: ListRenderItem<CartItem> = useCallback(
    ({ item }) => <CartItemRow item={item} product={getProduct(item.productId)} />,
    [getProduct]
  );

  const keyExtractor = useCallback((item: CartItem) => item.productId.toString(), []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={64}
            color={theme.colors.onSurfaceVariant}
          />
          <ThemedText variant="title" color="muted" style={styles.emptyText}>
            请先登录
          </ThemedText>
          <ThemedText variant="bodySmall" color="muted">
            登录后才能查看购物车
          </ThemedText>
          <Pressable
            style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('Login')}
          >
            <ThemedText variant="body" weight="600" style={{ color: '#fff' }}>
              去登录
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={64}
            color={theme.colors.onSurfaceVariant}
          />
          <ThemedText variant="title" color="muted" style={styles.emptyText}>
            购物车是空的
          </ThemedText>
          <ThemedText variant="bodySmall" color="muted">
            快去挑选心仪的商品吧
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* 全选栏 */}
      <View style={[styles.headerBar, { backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={toggleSelectAll} style={styles.selectAll}>
          <MaterialCommunityIcons
            name={allSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={22}
            color={allSelected ? theme.colors.primary : theme.colors.onSurfaceVariant}
          />
          <ThemedText variant="bodySmall">全选</ThemedText>
        </Pressable>
        <Pressable onPress={clearCart}>
          <ThemedText variant="bodySmall" color="error">
            清空购物车
          </ThemedText>
        </Pressable>
      </View>

      {/* 商品列表 */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* 底部结算栏 */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.footerLeft}>
          <ThemedText variant="bodySmall">
            已选 {selectedCount} 件
          </ThemedText>
          {selectedCount > 0 && (
            <ThemedText variant="body" weight="700" color="error">
              ¥{selectedTotal.toFixed(2)}
            </ThemedText>
          )}
        </View>
        <Pressable
          style={[
            styles.checkoutButton,
            {
              backgroundColor:
                selectedCount > 0 ? theme.colors.primary : theme.colors.surfaceVariant,
            },
          ]}
          disabled={selectedCount === 0}
        >
          <ThemedText
            variant="body"
            weight="600"
            style={{
              color: selectedCount > 0 ? '#fff' : theme.colors.onSurfaceVariant,
            }}
          >
            {isAuthenticated ? '去结算' : '登录后结算'}
          </ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyText: {
    marginTop: spacing.md,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  selectAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  checkbox: {
    padding: spacing.xs,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  itemInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    minWidth: 24,
    textAlign: 'center',
  },
  deleteButton: {
    padding: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkoutButton: {
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  loginButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
});
