import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, SoundProvider } from '@/app'
import { ErrorBoundary } from '@/ui/atoms'
import { App } from '@/ui/organisms'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </SoundProvider>
    </ThemeProvider>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
}
