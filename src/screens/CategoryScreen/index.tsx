import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

import { useRoute, RouteProp } from '@react-navigation/native';

import { useCategories } from '@/services/queries/useCategories';
import { useProductsByCategory } from '@/services/queries/useProducts';
import { MainTabParamList } from '@/navigation/AppNavigator';
import SearchBar from '@/components/common/SearchBar';
import ProductCard from '@/components/common/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import ThemedText from '@/components/ui/ThemedText';
import { Category, Product } from '#/models';
import { spacing, borderRadius } from '@/design-system/spacing';

function CategoryItem({
  category,
  isActive,
  onPress,
}: {
  category: Category;
  isActive: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.categoryItem,
        isActive && { backgroundColor: theme.colors.surface },
      ]}
    >
      <View
        style={[
          styles.activeIndicator,
          {
            backgroundColor: isActive ? theme.colors.primary : 'transparent',
          },
        ]}
      />
      <ThemedText
        variant="bodySmall"
        weight={isActive ? '600' : '400'}
        color={isActive ? 'primary' : 'default'}
      >
        {category.name}
      </ThemedText>
    </Pressable>
  );
}

export default function CategoryScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProp<MainTabParamList, 'Category'>>();
  const initialCategoryId = route.params?.categoryId;
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(initialCategoryId ?? 1);

  useEffect(() => {
    if (initialCategoryId !== undefined) {
      setSelectedCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErr,
    refetch: refetchCategories,
  } = useCategories();

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErr,
    refetch: refetchProducts,
  } = useProductsByCategory(selectedCategoryId);

  const handleCategoryPress = useCallback((id: number) => {
    setSelectedCategoryId(id);
  }, []);

  const handleRetry = useCallback(() => {
    refetchCategories();
    refetchProducts();
  }, [refetchCategories, refetchProducts]);

  const isLoading = categoriesLoading || productsLoading;
  const isError = categoriesError || productsError;
  const error = categoriesErr || productsErr;

  if (isLoading && !categories && !products) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message || '加载失败'} onRetry={handleRetry} />;
  }

  const renderCategory: ListRenderItem<Category> = useCallback(
    ({ item }) => (
      <CategoryItem
        category={item}
        isActive={item.id === selectedCategoryId}
        onPress={() => handleCategoryPress(item.id)}
      />
    ),
    [selectedCategoryId, handleCategoryPress]
  );

  const keyExtractor = useCallback((item: Category) => item.id.toString(), []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <SearchBar editable={false} />
      <View style={styles.content}>
        {/* 左侧分类列表 */}
        <View
          style={[
            styles.leftPanel,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          {categories && (
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* 右侧商品列表 */}
        <View style={styles.rightPanel}>
          {products && products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={({ item }) => (
                <View style={styles.productItem}>
                  <ProductCard
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    originalPrice={item.originalPrice}
                    image={item.image}
                    rating={item.rating}
                    sales={item.sales}
                    tags={item.tags}
                    isFlashSale={item.isFlashSale}
                    flashSalePrice={item.flashSalePrice}
                  />
                </View>
              )}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
              columnWrapperStyle={styles.productRow}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText variant="body" color="muted">
                该分类暂无商品
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: 90,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  activeIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  rightPanel: {
    flex: 1,
  },
  productsList: {
    padding: spacing.sm,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
