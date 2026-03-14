import type { GameStatus, GameStats } from '@/domain'

interface HudProps {
  minesRemaining: number
  elapsedSeconds: number
  status: GameStatus
  stats: GameStats
  difficultyLabel: string
  hintLabel: string
}

export function Hud({ minesRemaining, elapsedSeconds, status, stats, difficultyLabel, hintLabel }: HudProps) {
  return (
    <section className="ms-hud" aria-label="game-hud">
      <div className="ms-hud-primary">
        <div className="ms-hud-brand">
          <p className="ms-kicker">Current Run</p>
          <h2>{difficultyLabel}</h2>
        </div>
        <p className="ms-hud-hint">{hintLabel}</p>
      </div>

      <div className="ms-scoreboard">
        <article className="ms-scorecard">
          <span>Mines Left</span>
          <strong>{minesRemaining}</strong>
        </article>
        <article className="ms-scorecard">
          <span>Timer</span>
          <strong>{elapsedSeconds}s</strong>
        </article>
        <article className="ms-scorecard">
          <span>Status</span>
          <strong>{status}</strong>
        </article>
        <article className="ms-scorecard">
          <span>Wins</span>
          <strong>{stats.wins}</strong>
        </article>
        <article className="ms-scorecard">
          <span>Losses</span>
          <strong>{stats.losses}</strong>
        </article>
        <article className="ms-scorecard">
          <span>Best Streak</span>
          <strong>{stats.bestStreak}</strong>
        </article>
      </div>
    </section>
  )
}