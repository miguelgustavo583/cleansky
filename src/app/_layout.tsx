import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { colors } from '@/theme/colors';
import { CleanSkyProvider } from '@/context/CleanSkyContext';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: colors.background,
    surface: colors.surface,
    primary: colors.text,
    onPrimary: '#000000',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <CleanSkyProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </CleanSkyProvider>
    </PaperProvider>
  );
}