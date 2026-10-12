/**
 * Faraz Pharmacy Design System
 * Premium, clinical, modern, restrained
 */

export const tokens = {
  colors: {
    light: {
      background: "#F7F9F9",
      surface: "#FFFFFF",
      elevated: "#FFFFFF",
      text: "#1A2624",
      muted: "#5B6B68",
      border: "#E4E9E8",
      primary: "#0E7C66",
      primaryHover: "#095443",
      primaryTint: "#E6F4F0",
      champagne: "#C8A45D",
    },
    dark: {
      background: "#0B1F1D",
      surface: "#102624",
      elevated: "#163330",
      text: "#F7F9F9",
      muted: "#A1B5B1",
      border: "#1E3F3B",
      primary: "#0E7C66",
      primaryHover: "#129A7F",
      champagne: "#C8A45D",
    },
    semantic: {
      success: "#1F9D55",
      warning: "#F5A524",
      danger: "#D64550",
      info: "#3B82F6",
      champagne: "#C8A45D",
    },
  },

  animation: {
    hover: "100-150ms",
    dropdown: "150-200ms",
    modal: "150-200ms",
    toast: "200ms",
  },

  principles: {
    style: "premium, clinical, modern, restrained",
    typography: "Inter / Inter Tight / JetBrains Mono",
    interaction: "keyboard-first",
    pos: "optimized for barcode scanning and rapid transactions",
    dashboard: "operationally useful, not decorative",
    tables: "dense data, generous row height",
    animation: "subtle and functional",
  },
} as const;

export type DesignTokens = typeof tokens;
