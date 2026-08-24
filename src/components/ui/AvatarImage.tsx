import React from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { borderRadius } from '@/design-system/spacing';

interface AvatarImageProps {
  source: string;
  size?: number;
  placeholder?: string;
}

export default function AvatarImage({ source, size = 48, placeholder }: AvatarImageProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        backgroundColor: theme.colors.surfaceVariant,
      }}
    >
      <Image
        source={{ uri: source }}
        style={{ width: size, height: size }}
        contentFit="cover"
        transition={300}
        placeholder={placeholder ? { blurhash: placeholder } : undefined}
        cachePolicy="memory-disk"
      />
    </View>
  );
}
