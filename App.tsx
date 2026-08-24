import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppNavigator from '@/navigation/AppNavigator';
import { useThemeStore } from '@/stores/useThemeStore';
import { lightTheme, darkTheme } from '@/constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { mode } = useThemeStore();
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
        <AppNavigator />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
