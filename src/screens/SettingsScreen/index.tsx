import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useThemeStore } from '@/stores/useThemeStore';
import { APP_CONFIG } from '@/constants/config';
import ThemedText from '@/components/ui/ThemedText';
import { spacing, borderRadius } from '@/design-system/spacing';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface SettingRowProps {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
  showArrow?: boolean;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingRow({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  right,
  showArrow = false,
  onPress,
  isLast = false,
}: SettingRowProps) {
  const theme = useTheme();

  const content = (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowContent}>
        <ThemedText variant="body" weight="500">
          {title}
        </ThemedText>
        {!!description && (
          <ThemedText variant="caption" color="muted">
            {description}
          </ThemedText>
        )}
      </View>
      <View style={styles.rowRight}>
        {right}
        {!!showArrow && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

interface SettingsCardProps {
  title: string;
  children: React.ReactNode;
}

function SettingsCard({ title, children }: SettingsCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          boxShadow: theme.dark
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <ThemedText variant="label" color="muted" weight="600">
          {title}
        </ThemedText>
      </View>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeStore();
  const isDarkMode = mode === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 页面头部 */}
        <View style={styles.header}>
          <ThemedText variant="headline" weight="800">
            设置
          </ThemedText>
          <ThemedText variant="body" color="muted">
            个性化您的应用体验
          </ThemedText>
        </View>

        {/* 外观分组 */}
        <SettingsCard title="外观">
          <SettingRow
            icon={isDarkMode ? 'weather-night' : 'white-balance-sunny'}
            iconBg={theme.colors.primaryContainer}
            iconColor={theme.colors.primary}
            title="深色模式"
            description={isDarkMode ? '已开启深色主题' : '已关闭'}
            right={
              <Switch
                value={isDarkMode}
                trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            }
            onPress={toggleTheme}
            isLast
          />
        </SettingsCard>

        {/* 关于分组 */}
        <SettingsCard title="关于">
          <SettingRow
            icon="information"
            iconBg={theme.colors.secondaryContainer}
            iconColor={theme.colors.secondary}
            title="应用名称"
            description={APP_CONFIG.name}
          />
          <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          <SettingRow
            icon="tag"
            iconBg={theme.colors.secondaryContainer}
            iconColor={theme.colors.secondary}
            title="版本号"
            description={APP_CONFIG.version}
            isLast
          />
        </SettingsCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xs,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowLast: {
    paddingBottom: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: {
    flex: 1,
    gap: spacing.xs,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  divider: {
    height: 1,
    marginLeft: spacing.lg + 36 + spacing.md,
    marginRight: spacing.lg,
  },
});
