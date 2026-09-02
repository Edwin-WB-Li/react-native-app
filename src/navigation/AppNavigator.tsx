import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import HomeScreen from '@/screens/HomeScreen';
import CategoryScreen from '@/screens/CategoryScreen';
import CartScreen from '@/screens/CartScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import PostDetailScreen from '@/screens/PostDetailScreen';
import ProductDetailScreen from '@/screens/ProductDetailScreen';
import SearchScreen from '@/screens/SearchScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';

export type RootStackParamList = {
  MainTabs: undefined;
  PostDetail: { postId: number };
  ProductDetail: { productId: number };
  Search: undefined;
  Login: undefined;
  Register: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Category: { categoryId?: number } | undefined;
  Cart: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Category: { active: 'view-grid', inactive: 'view-grid-outline' },
  Cart: { active: 'cart', inactive: 'cart-outline' },
  Profile: { active: 'account', inactive: 'account-outline' },
};

function AnimatedTabIcon({
  routeName,
  focused,
  color,
}: {
  routeName: string;
  focused: boolean;
  color: string;
}) {
  const scale = useSharedValue(focused ? 1.15 : 1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.15 : 1, {
      damping: 12,
      stiffness: 250,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const icons = TAB_ICONS[routeName];
  if (!icons) return null;

  return (
    <Animated.View style={animatedStyle}>
      <MaterialCommunityIcons
        name={focused ? icons.active : icons.inactive}
        size={24}
        color={color}
      />
    </Animated.View>
  );
}

function TabBarIconWrapper({
  routeName,
  focused,
  color,
}: {
  routeName: string;
  focused: boolean;
  color: string;
}) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 28 }}>
      <AnimatedTabIcon routeName={routeName} focused={focused} color={color} />
    </View>
  );
}

function CartTabIcon({
  routeName,
  focused,
  color,
}: {
  routeName: string;
  focused: boolean;
  color: string;
}) {
  const totalCount = useCartStore(state => state.getTotalCount());
  const { isAuthenticated } = useAuthStore();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 28 }}>
      <AnimatedTabIcon routeName={routeName} focused={focused} color={color} />
      {isAuthenticated && totalCount > 0 ? <View
          style={{
            position: 'absolute',
            top: -4,
            right: -8,
            backgroundColor: '#EF4444',
            borderRadius: 10,
            minWidth: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
          }}
        >
          <React.Fragment>
            {totalCount > 99 ? (
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' }} />
            ) : (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: '700',
                  lineHeight: 14,
                }}
              >
                {totalCount}
              </Text>
            )}
          </React.Fragment>
        </View> : null}
    </View>
  );
}

function MainTabNavigator() {
  const theme = useTheme();
  const { isAuthenticated } = useAuthStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: theme.dark
            ? '0 -4px 16px rgba(0, 0, 0, 0.35)'
            : '0 -4px 16px rgba(0, 0, 0, 0.06)',
          paddingTop: 6,
          paddingBottom: 6,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          if (route.name === 'Cart') {
            return <CartTabIcon routeName={route.name} focused={focused} color={color} />;
          }
          return <TabBarIconWrapper routeName={route.name} focused={focused} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '首页' }}
      />
      <Tab.Screen
        name="Category"
        component={CategoryScreen}
        options={{ title: '分类' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: '购物车' }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            if (!isAuthenticated) {
              e.preventDefault();
              navigation.navigate('Login');
            }
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: '我的' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontWeight: '700',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostDetail"
          component={PostDetailScreen}
          options={{ title: '文章详情' }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: '商品详情' }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: '搜索', headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: '登录', headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: '注册', headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: '设置' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
