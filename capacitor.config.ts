import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.scottdreinhart.minesweeper',
  appName: 'Minesweeper',
  webDir: 'dist',
  server: { androidScheme: 'https' },
}

export default config
