import React from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import { borderRadius } from '@/design-system/spacing';

interface CardProps extends ViewProps {
  onPress?: () => void;
  pressable?: boolean;
  children: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Card({ onPress, pressable = false, children, style, ...props }: CardProps) {
  const theme = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(pressed.value, [0, 1], [1, 0.97]),
      },
    ],
  }));

  const handlePressIn = () => {
    if (pressable) {
      pressed.value = withTiming(1, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (pressable) {
      pressed.value = withTiming(0, { duration: 150 });
    }
  };

  const content = (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: borderRadius.xl,
          borderCurve: 'continuous',
          overflow: 'hidden',
          boxShadow:
            theme.dark
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  if (pressable && onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
}
