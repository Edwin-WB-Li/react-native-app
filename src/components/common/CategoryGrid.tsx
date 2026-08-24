import React, { memo, useCallback } from 'react';
import { View, StyleSheet, Pressable, FlatList, ListRenderItem } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from '@/navigation/AppNavigator';
import ThemedText from '@/components/ui/ThemedText';
import { spacing, borderRadius } from '@/design-system/spacing';
import { Category } from '#/models';

interface CategoryGridProps {
  categories: Category[];
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList & MainTabParamList>;
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function CategoryItem({
  category,
  onPress,
}: {
  category: Category;
  onPress: (id: number) => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onPress(category.id)}
      style={styles.categoryItem}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <MaterialCommunityIcons
          name={(category.icon as IconName) || 'help-circle'}
          size={24}
          color={theme.colors.primary}
        />
      </View>
      <ThemedText variant="caption" style={styles.categoryName}>
        {category.name}
      </ThemedText>
    </Pressable>
  );
}

function CategoryGrid({ categories }: CategoryGridProps) {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(
    (id: number) => {
      navigation.navigate('MainTabs', {
        screen: 'Category',
        params: { categoryId: id },
      } as never);
    },
    [navigation]
  );

  const renderItem: ListRenderItem<Category> = useCallback(
    ({ item }) => <CategoryItem category={item} onPress={handlePress} />,
    [handlePress]
  );

  const keyExtractor = useCallback((item: Category) => item.id.toString(), []);

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={4}
      scrollEnabled={false}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    width: '25%',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryName: {
    textAlign: 'center',
  },
});

export default memo(CategoryGrid);
