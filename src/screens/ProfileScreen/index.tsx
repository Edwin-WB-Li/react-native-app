import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/stores/useAuthStore';
import ThemedText from '@/components/ui/ThemedText';
import AvatarImage from '@/components/ui/AvatarImage';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { spacing, borderRadius } from '@/design-system/spacing';

const AVATAR_SIZE = 100;
const HEADER_HEIGHT = 180;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function StatItem({ value, label, icon }: { value: string; label: string; icon: IconName }) {
  const theme = useTheme();

  return (
    <View style={styles.statItem}>
      <MaterialCommunityIcons name={icon} size={20} color={theme.colors.primary} style={styles.statIcon} />
      <ThemedText variant="title" weight="700" color="primary">
        {value}
      </ThemedText>
      <ThemedText variant="caption" color="muted">
        {label}
      </ThemedText>
    </View>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const avatarUrl = isAuthenticated
    ? `https://picsum.photos/seed/user${user?.id}/200/200`
    : undefined;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 顶部背景装饰 */}
        <View style={[styles.headerBackground, { backgroundColor: theme.colors.primary, height: HEADER_HEIGHT }]}>
          <View style={styles.headerDecoration}>
            <MaterialCommunityIcons name="account-circle" size={120} color="rgba(255,255,255,0.08)" />
          </View>
        </View>

        {/* 个人资料卡片 */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.colors.surface,
              boxShadow: theme.dark
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
            },
          ]}
        >
          {/* 头像 - 负 margin 向上偏移，叠加在背景上 */}
          <View style={styles.avatarWrapper}>
            <View
              style={[
                styles.avatarBorder,
                {
                  borderColor: theme.colors.surface,
                  backgroundColor: theme.colors.surface,
                },
              ]}
            >
              {isAuthenticated && user ? (
                <AvatarImage
                  source={avatarUrl!}
                  size={AVATAR_SIZE}
                  placeholder="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      width: AVATAR_SIZE,
                      height: AVATAR_SIZE,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="account"
                    size={48}
                    color={theme.colors.onSurfaceVariant}
                  />
                </View>
              )}
            </View>
          </View>

          {/* 用户名 */}
          <ThemedText variant="headline" weight="700" style={styles.name}>
            {isAuthenticated && user ? user.name : '未登录'}
          </ThemedText>

          {/* 邮箱/描述 */}
          <ThemedText variant="body" color="muted" style={styles.email}>
            {isAuthenticated && user ? user.email : '请先登录以使用完整功能'}
          </ThemedText>

          {/* 订单统计行 */}
          <View style={[styles.statsRow, { borderTopColor: theme.colors.outline }]}>
            <StatItem value={isAuthenticated ? '2' : '-'} label="待付款" icon="credit-card-clock" />
            <View style={[styles.statDivider, { backgroundColor: theme.colors.outline }]} />
            <StatItem value={isAuthenticated ? '1' : '-'} label="待发货" icon="truck-fast" />
            <View style={[styles.statDivider, { backgroundColor: theme.colors.outline }]} />
            <StatItem value={isAuthenticated ? '3' : '-'} label="待收货" icon="package-variant" />
          </View>

          {/* 操作按钮 */}
          <Pressable
            onPress={isAuthenticated ? logout : handleLogin}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: isAuthenticated ? theme.colors.errorContainer : theme.colors.primary,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isAuthenticated ? 'logout' : 'login'}
              size={20}
              color={isAuthenticated ? theme.colors.error : '#FFFFFF'}
              style={styles.buttonIcon}
            />
            <ThemedText
              variant="body"
              weight="600"
              style={{ color: isAuthenticated ? theme.colors.error : '#FFFFFF' }}
            >
              {isAuthenticated ? '退出登录' : '立即登录'}
            </ThemedText>
          </Pressable>
        </View>

        {/* 设置入口 */}
        <Pressable
          onPress={() => navigation.navigate('Settings' as never)}
          style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.settingsLeft}>
            <MaterialCommunityIcons name="cog-outline" size={22} color={theme.colors.onSurface} />
            <ThemedText variant="body" weight="500">
              设置
            </ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
        </Pressable>
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
    gap: spacing.md,
  },
  headerBackground: {
    position: 'relative',
    justifyContent: 'flex-end',
    paddingBottom: spacing['2xl'],
  },
  headerDecoration: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
  profileCard: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing['2xl'],
    borderRadius: borderRadius['2xl'],
    borderCurve: 'continuous',
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['2xl'],
    alignItems: 'center',
  },
  avatarWrapper: {
    marginTop: -(AVATAR_SIZE / 2),
  },
  avatarBorder: {
    borderRadius: borderRadius.full,
    borderWidth: 4,
    padding: 2,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginTop: spacing.lg,
  },
  email: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIcon: {
    marginBottom: spacing.xs,
  },
  statDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  settingsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius['2xl'],
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
