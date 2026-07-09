// constants/colors.js
const novaTheme = {
  primary: "#6C7CFF",
  secondary: "#16C7A7",
  background: "#07111F",
  surface: "#0F1B2C",
  surfaceAlt: "#16253A",
  text: "#F4F7FF",
  border: "#22324A",
  white: "#FFFFFF",
  muted: "#8AA0BF",
  expense: "#FF6B6B",
  income: "#2ED6A2",
  card: "#14233A",
  shadow: "#000000",
};

const coffeeTheme = {
  primary: "#8B593E",
  secondary: "#D98B5F",
  background: "#FFF8F3",
  surface: "#FFFDF8",
  surfaceAlt: "#F7EADB",
  text: "#4A3428",
  border: "#E5D3B7",
  white: "#FFFFFF",
  muted: "#9A8478",
  expense: "#E74C3C",
  income: "#2ECC71",
  card: "#FFFFFF",
  shadow: "#000000",
};

export const THEMES = {
  nova: novaTheme,
  coffee: coffeeTheme,
};

// 👇 change this to switch theme
export const COLORS = THEMES.nova;
