import React, { useCallback } from 'react';
import {
  StyleSheet,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

import { useBanners } from '@/services/queries/useProducts';
import { useFlashSaleProducts } from '@/services/queries/useProducts';
import { useRecommendedProducts } from '@/services/queries/useProducts';
import { useCategories } from '@/services/queries/useCategories';
import SearchBar from '@/components/common/SearchBar';
import BannerCarousel from '@/components/common/BannerCarousel';
import CategoryGrid from '@/components/common/CategoryGrid';
import FlashSaleSection from '@/components/common/FlashSaleSection';
import ProductCard from '@/components/common/ProductCard';
import SectionHeader from '@/components/common/SectionHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Product } from '#/models';
import { spacing } from '@/design-system/spacing';

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <View style={styles.grid}>
      {products.map(product => (
        <View key={product.id} style={styles.gridItem}>
          <ProductCard
            id={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.image}
            rating={product.rating}
            sales={product.sales}
            tags={product.tags}
            isFlashSale={product.isFlashSale}
            flashSalePrice={product.flashSalePrice}
          />
        </View>
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();

  const {
    data: banners,
    isLoading: bannersLoading,
    isError: bannersError,
    error: bannersErr,
    refetch: refetchBanners,
  } = useBanners();

  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useCategories();

  const {
    data: flashSaleProducts,
    isLoading: flashSaleLoading,
  } = useFlashSaleProducts();

  const {
    data: recommendedProducts,
    isLoading: recommendedLoading,
    isError: recommendedError,
    error: recommendedErr,
    refetch: refetchRecommended,
  } = useRecommendedProducts();

  const isLoading = bannersLoading || categoriesLoading || flashSaleLoading || recommendedLoading;
  const isError = bannersError || recommendedError;
  const error = bannersErr || recommendedErr;

  const handleRetry = useCallback(() => {
    refetchBanners();
    refetchRecommended();
  }, [refetchBanners, refetchRecommended]);

  if (isLoading && !banners && !recommendedProducts) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message || '加载失败'} onRetry={handleRetry} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRetry} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 搜索栏 */}
        <SearchBar editable={false} />

        {/* 轮播图 */}
        {banners && banners.length > 0 && <BannerCarousel banners={banners} />}

        {/* 分类入口 */}
        {categories && categories.length > 0 && (
          <CategoryGrid categories={categories} />
        )}

        {/* 秒杀专区 */}
        {flashSaleProducts && flashSaleProducts.length > 0 && (
          <FlashSaleSection products={flashSaleProducts} />
        )}

        {/* 推荐商品 */}
        {recommendedProducts && recommendedProducts.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="为你推荐"
              subtitle="精选好物，品质生活"
            />
            <ProductGrid products={recommendedProducts} />
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
  },
  gridItem: {
    width: '50%',
    padding: spacing.xs,
  },
  bottomPadding: {
    height: spacing['3xl'],
  },
});
