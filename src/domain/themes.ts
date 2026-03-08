// Color theme, mode & colorblind definitions + DEFAULT_SETTINGS
export type ThemeName = 'classic' | 'ocean' | 'sunset' | 'forest' | 'rose' | 'midnight' | 'highcontrast'
export type Mode = 'light' | 'dark' | 'system'

export interface ThemeSettings {
  theme: ThemeName
  mode: Mode
  colorblind: boolean
}

export const DEFAULT_SETTINGS: ThemeSettings = {
  theme: 'classic',
  mode: 'system',
  colorblind: false,
}

export const THEME_NAMES: ThemeName[] = ['classic', 'ocean', 'sunset', 'forest', 'rose', 'midnight', 'highcontrast']
