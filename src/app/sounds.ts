let ctx: AudioContext | null = null
function getCtx() {
  if (!ctx) {
    ctx = new AudioContext()
  }
  return ctx
}

export function playClick() {
  const c = getCtx(),
    o = c.createOscillator(),
    g = c.createGain()
  o.connect(g).connect(c.destination)
  o.frequency.value = 600
  g.gain.setValueAtTime(0.15, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1)
  o.start()
  o.stop(c.currentTime + 0.1)
}

export function playReveal() {
  const c = getCtx(),
    o = c.createOscillator(),
    g = c.createGain()
  o.connect(g).connect(c.destination)
  o.frequency.value = 800
  g.gain.setValueAtTime(0.1, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05)
  o.start()
  o.stop(c.currentTime + 0.05)
}

export function playExplosion() {
  const c = getCtx(),
    o = c.createOscillator(),
    g = c.createGain()
  o.type = 'sawtooth'
  o.connect(g).connect(c.destination)
  o.frequency.value = 150
  g.gain.setValueAtTime(0.3, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4)
  o.start()
  o.stop(c.currentTime + 0.4)
}

export function playWin() {
  const c = getCtx()
  ;[523, 659, 784].forEach((f, i) => {
    const o = c.createOscillator(),
      g = c.createGain()
    o.connect(g).connect(c.destination)
    o.frequency.value = f
    g.gain.setValueAtTime(0.15, c.currentTime + i * 0.15)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.15 + 0.3)
    o.start(c.currentTime + i * 0.15)
    o.stop(c.currentTime + i * 0.15 + 0.3)
  })
}
