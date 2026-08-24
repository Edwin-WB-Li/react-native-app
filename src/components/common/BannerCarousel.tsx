import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';

import { spacing, borderRadius } from '@/design-system/spacing';

interface Banner {
  id: number;
  image: string;
  link: string;
}

interface BannerCarouselProps {
  banners: Banner[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 160;

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {banners.map(banner => (
          <View key={banner.id} style={styles.page}>
            <Image
              source={{ uri: banner.image }}
              style={styles.image}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <Dot
            key={index}
            index={index}
            activeIndex={activeIndex}
            color={theme.colors.primary}
          />
        ))}
      </View>
    </View>
  );
}

function Dot({
  index,
  activeIndex,
  color,
}: {
  index: number;
  activeIndex: number;
  color: string;
}) {
  const isActive = index === activeIndex;
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(isActive ? 16 : 6, { duration: 200 }),
    backgroundColor: isActive ? color : 'rgba(0,0,0,0.2)',
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  page: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
    paddingHorizontal: spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
