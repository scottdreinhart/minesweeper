import { useState, useEffect, useCallback } from 'react'
import type { ThemeName, Mode, ThemeSettings } from '@/domain'
import { DEFAULT_SETTINGS } from '@/domain'
import { load, save } from './storageService'

const KEY = 'minesweeper-theme'

export function useTheme() {
  const [settings, setSettings] = useState<ThemeSettings>(() => load(KEY, DEFAULT_SETTINGS))

  useEffect(() => { save(KEY, settings) }, [settings])
  useEffect(() => { document.documentElement.dataset.theme = settings.theme }, [settings.theme])

  const setTheme = useCallback((theme: ThemeName) => setSettings(s => ({ ...s, theme })), [])
  const setMode = useCallback((mode: Mode) => setSettings(s => ({ ...s, mode })), [])
  const toggleColorblind = useCallback(() => setSettings(s => ({ ...s, colorblind: !s.colorblind })), [])

  return { ...settings, setTheme, setMode, toggleColorblind }
}
