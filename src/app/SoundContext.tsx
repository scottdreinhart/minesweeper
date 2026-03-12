import { createContext, useContext, type ReactNode } from 'react'
import { useSoundEffects } from './useSoundEffects'

type SoundContextValue = ReturnType<typeof useSoundEffects>
const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  const value = useSoundEffects()
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSoundContext(): SoundContextValue {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSoundContext must be used within SoundProvider')
  }
  return ctx
}
