import { AnimatedLogo } from './AnimatedLogo'

export function SplashScreen() {
  return (
    <section className="ms-splash" aria-label="splash-screen">
      <div className="ms-splash-grid" />
      <div className="ms-splash-panel">
        <AnimatedLogo />
        <p className="ms-kicker">WASM Edition</p>
        <h1>Minesweeper</h1>
        <p className="ms-splash-copy">Calibrating minefield generator, hint engine, and board systems.</p>
      </div>
    </section>
  )
}