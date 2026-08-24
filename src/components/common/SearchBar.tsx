import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation/AppNavigator';
import { spacing, borderRadius } from '@/design-system/spacing';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (keyword: string) => void;
  editable?: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchBar({
  placeholder = '搜索商品',
  value,
  onChangeText,
  onSubmit,
  editable = true,
}: SearchBarProps) {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [internalValue, setInternalValue] = useState('');

  const keyword = value !== undefined ? value : internalValue;
  const setKeyword = onChangeText || setInternalValue;

  const handlePress = useCallback(() => {
    if (!editable) {
      navigation.navigate('Search');
    }
  }, [editable, navigation]);

  const handleSubmit = useCallback(() => {
    if (keyword.trim() && onSubmit) {
      onSubmit(keyword.trim());
    }
  }, [keyword, onSubmit]);

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.dark
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.05)',
          },
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={theme.colors.onSurfaceVariant}
        />
        <TextInput
          style={[styles.input, { color: theme.colors.onSurface }]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSubmit}
          editable={editable}
          pointerEvents={editable ? 'auto' : 'none'}
          returnKeyType="search"
        />
        {keyword.length > 0 && editable && (
          <Pressable onPress={() => setKeyword('')}>
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color={theme.colors.onSurfaceVariant}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
});
