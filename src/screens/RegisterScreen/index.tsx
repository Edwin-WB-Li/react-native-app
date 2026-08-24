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
import { isValidEmail, validatePassword } from '@/utils/helpers';
import { spacing, borderRadius } from '@/design-system/spacing';

export default function RegisterScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register, setError, error } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = useCallback(() => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('请填写所有字段');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('请输入有效的邮箱地址');
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      setError(passwordCheck.message || '密码格式不正确');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    register(name.trim(), email.trim(), password);
    navigation.goBack();
  }, [name, email, password, confirmPassword, register, setError, navigation]);

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
          创建账号
        </ThemedText>
        <ThemedText variant="body" color="muted" style={styles.subtitle}>
          注册以开始购物之旅
        </ThemedText>

        {/* 错误提示 */}
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: theme.colors.errorContainer }]}>
            <ThemedText variant="bodySmall" color="error">
              {error}
            </ThemedText>
          </View>
        ) : null}

        {/* 姓名输入 */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <MaterialCommunityIcons
            name="account-outline"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.onSurface }]}
            placeholder="用户名"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={name}
            onChangeText={setName}
          />
        </View>

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

        {/* 确认密码 */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <MaterialCommunityIcons
            name="lock-check-outline"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.onSurface }]}
            placeholder="确认密码"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>

        {/* 注册按钮 */}
        <Pressable
          onPress={handleRegister}
          style={[
            styles.registerButton,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <ThemedText variant="body" weight="600" style={{ color: '#fff' }}>
            注册
          </ThemedText>
        </Pressable>

        {/* 登录链接 */}
        <View style={styles.loginRow}>
          <ThemedText variant="bodySmall" color="muted">
            已有账号？
          </ThemedText>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <ThemedText variant="bodySmall" color="primary" weight="600">
              去登录
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
  registerButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
});
