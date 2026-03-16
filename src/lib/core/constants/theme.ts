// Colores y tipografía de la aplicación
// Reemplaza los valores con la paleta definitiva del diseño

export const colors = {
  primary: '#0A7AFF',
  primaryDark: '#005FCC',
  secondary: '#FF9500',
  background: '#FFFFFF',
  backgroundDark: '#000000',
  surface: '#F2F2F7',
  surfaceDark: '#1C1C1E',
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  border: '#C6C6C8',
} as const;

export const typography = {
  fontSizeXs: 11,
  fontSizeSm: 13,
  fontSizeMd: 15,
  fontSizeLg: 17,
  fontSizeXl: 20,
  fontSizeXxl: 28,
  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemibold: '600' as const,
  fontWeightBold: '700' as const,
} as const;
