import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/stores/useAuthStore';
import ThemedText from '@/components/ui/ThemedText';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { isValidEmail } from '@/utils/helpers';
import { spacing, borderRadius } from '@/design-system/spacing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    gap: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing['2xl'],
  },
  errorBox: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  loginButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
});

export default function LoginScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login, setError, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = useCallback(() => {
    if (!email.trim() || !password.trim()) {
      setError('请填写邮箱和密码');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('请输入有效的邮箱地址');
      return;
    }

    // Mock login
    login({
      id: 1,
      name: email.split('@')[0],
      email: email.trim(),
      avatar: `https://picsum.photos/seed/user${Date.now()}/200/200`,
    });
    navigation.goBack();
  }, [email, password, login, setError, navigation]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* 返回按钮 */}
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={theme.colors.onSurface}
        />
      </Pressable>

      <View style={styles.content}>
        {/* 标题 */}
        <ThemedText variant="headline" weight="700" style={styles.title}>
          欢迎回来
        </ThemedText>
        <ThemedText variant="body" color="muted" style={styles.subtitle}>
          登录以继续购物
        </ThemedText>

        {/* 错误提示 */}
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: theme.colors.errorContainer }]}>
            <ThemedText variant="bodySmall" color="error">
              {error}
            </ThemedText>
          </View>
        ) : null}

        {/* 邮箱输入 */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.onSurface }]}
            placeholder="邮箱地址"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* 密码输入 */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <MaterialCommunityIcons
            name="lock-outline"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.onSurface }]}
            placeholder="密码"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          </Pressable>
        </View>

        {/* 登录按钮 */}
        <Pressable
          onPress={handleLogin}
          style={[
            styles.loginButton,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <ThemedText variant="body" weight="600" style={{ color: '#fff' }}>
            登录
          </ThemedText>
        </Pressable>

        {/* 注册链接 */}
        <View style={styles.registerRow}>
          <ThemedText variant="bodySmall" color="muted">
            还没有账号？
          </ThemedText>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <ThemedText variant="bodySmall" color="primary" weight="600">
              立即注册
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

