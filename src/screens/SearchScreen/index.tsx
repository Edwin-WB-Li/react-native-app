import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, FlatList, ListRenderItem, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useHotKeywords, useSearchSuggestions, useSearchProducts } from '@/services/queries/useSearch';
import { useSearchHistoryStore } from '@/stores/useSearchHistoryStore';
import SearchBar from '@/components/common/SearchBar';
import ProductCard from '@/components/common/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThemedText from '@/components/ui/ThemedText';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { spacing, borderRadius } from '@/design-system/spacing';
import { Product } from '#/models';

export default function SearchScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');

  const { items: historyItems, removeKeyword, clearHistory } = useSearchHistoryStore();
  const { data: hotKeywords } = useHotKeywords();
  const { data: suggestions } = useSearchSuggestions(keyword);
  const { data: searchResults, isLoading } = useSearchProducts(submittedKeyword);

  const handleSearch = useCallback(
    (text: string) => {
      setKeyword(text);
      setSubmittedKeyword(text);
      useSearchHistoryStore.getState().addKeyword(text);
    },
    []
  );

  const handleSuggestionPress = useCallback(
    (text: string) => {
      setKeyword(text);
      setSubmittedKeyword(text);
      useSearchHistoryStore.getState().addKeyword(text);
    },
    []
  );

  const renderProduct: ListRenderItem<Product> = useCallback(
    ({ item }) => (
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
        />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  // 显示搜索结果
  if (submittedKeyword) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <SearchBar
          placeholder="搜索商品"
          onSubmit={handleSearch}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : searchResults && searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderProduct}
            keyExtractor={keyExtractor}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsList}
            columnWrapperStyle={styles.productRow}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText variant="body" color="muted">
              未找到相关商品
            </ThemedText>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // 显示搜索建议
  if (keyword && suggestions && suggestions.length > 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <SearchBar placeholder="搜索商品" onSubmit={handleSearch} />
        <View style={styles.suggestionsList}>
          {suggestions.map((s: string) => (
            <Pressable
              key={s}
              style={[
                styles.suggestionItem,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => handleSuggestionPress(s)}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
              <ThemedText variant="bodySmall">{s}</ThemedText>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // 显示搜索历史 + 热搜
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <SearchBar placeholder="搜索商品" onSubmit={handleSearch} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 搜索历史 */}
        {historyItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText variant="title" weight="600">
                搜索历史
              </ThemedText>
              <Pressable onPress={clearHistory}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={18}
                  color={theme.colors.onSurfaceVariant}
                />
              </Pressable>
            </View>
            <View style={styles.chipsContainer}>
              {historyItems.map(item => (
                <Pressable
                  key={item.keyword}
                  style={[
                    styles.chip,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  onPress={() => handleSuggestionPress(item.keyword)}
                >
                  <ThemedText variant="caption">{item.keyword}</ThemedText>
                  <Pressable
                    onPress={() => removeKeyword(item.keyword)}
                    style={styles.chipClose}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={12}
                      color={theme.colors.onSurfaceVariant}
                    />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* 热门搜索 */}
        {hotKeywords && hotKeywords.length > 0 && (
          <View style={styles.section}>
            <ThemedText variant="title" weight="600" style={styles.sectionTitle}>
              热门搜索
            </ThemedText>
            <View style={styles.chipsContainer}>
              {hotKeywords.map((k: string, index: number) => (
                <Pressable
                  key={k}
                  style={[
                    styles.chip,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  onPress={() => handleSuggestionPress(k)}
                >
                  <ThemedText
                    variant="caption"
                    color={index < 3 ? 'error' : 'default'}
                    weight={index < 3 ? '700' : '400'}
                  >
                    {index + 1}. {k}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    gap: spacing.xs,
  },
  chipClose: {
    marginLeft: spacing.xs,
  },
  suggestionsList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  resultsList: {
    padding: spacing.md,
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
