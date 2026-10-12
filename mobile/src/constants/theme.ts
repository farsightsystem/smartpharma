import '@/global.css';

import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A2624',
    background: '#F7F9F9',
    backgroundElement: '#F0F4F3',
    backgroundSelected: '#E6F4F0',
    textSecondary: '#5B6B68',
    surface: '#FFFFFF',
    surface2: '#F0F4F3',
    accent: '#0E7C66',
    accentHover: '#095443',
    accentFg: '#FFFFFF',
    danger: '#D64550',
    success: '#1F9D55',
    warning: '#F5A524',
    info: '#3B82F6',
    border: '#E4E9E8',
    borderStrong: '#CBD5D2',
    muted: '#F7F9F9',
    mutedFg: '#82928F',
  },
  dark: {
    text: '#F7F9F9',
    background: '#0B1F1D',
    backgroundElement: '#132E2B',
    backgroundSelected: '#163330',
    textSecondary: '#A1B5B1',
    surface: '#102624',
    surface2: '#163330',
    accent: '#0E7C66',
    accentHover: '#129A7F',
    accentFg: '#FFFFFF',
    danger: '#D64550',
    success: '#1F9D55',
    warning: '#F5A524',
    info: '#3B82F6',
    border: '#1E3F3B',
    borderStrong: '#2A544F',
    muted: '#163330',
    mutedFg: '#6E827E',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const AppTheme: { light: Theme; dark: Theme } = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.accent,
      background: Colors.light.background,
      card: Colors.light.surface,
      text: Colors.light.text,
      border: Colors.light.border,
      notification: Colors.light.danger,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.accent,
      background: Colors.dark.background,
      card: Colors.dark.surface,
      text: Colors.dark.text,
      border: Colors.dark.border,
      notification: Colors.dark.danger,
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export type ColorsType = typeof Colors.light;
