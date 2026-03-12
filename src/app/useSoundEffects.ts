import { useCallback, useState } from 'react'
import { playClick, playExplosion, playReveal, playWin } from './sounds'

export function useSoundEffects() {
  const [enabled, setEnabled] = useState(true)
  const toggle = useCallback(() => setEnabled((e) => !e), [])
  const play = useCallback(
    (fn: () => void) => {
      if (enabled) {
        fn()
      }
    },
    [enabled],
  )

  return {
    soundEnabled: enabled,
    toggleSound: toggle,
    click: () => play(playClick),
    reveal: () => play(playReveal),
    explosion: () => play(playExplosion),
    win: () => play(playWin),
  }
}
