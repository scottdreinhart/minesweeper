import type { Difficulty, GameStats } from '@/domain'

interface LandingPageProps {
  difficulty: Difficulty
  difficulties: readonly Difficulty[]
  onDifficultyChange: (difficulty: Difficulty) => void
  onStart: () => void
  onViewScores: () => void
  stats: GameStats
}

export function LandingPage({ difficulty, difficulties, onDifficultyChange, onStart, onViewScores, stats }: LandingPageProps) {
  return (
    <section className="ms-landing" aria-label="landing-page">
      <div className="ms-landing-hero">
        <p className="ms-kicker">Field Command</p>
        <h1>Minesweeper</h1>
        <p>
          A modern control room for classic board-clearing. Start a run, manage settings from the menu,
          and use the HUD to track pressure, pace, and streaks.
        </p>
        <div className="ms-landing-actions">
          <label className="ms-field">
            <span>Difficulty</span>
            <select value={difficulty} onChange={(event) => onDifficultyChange(event.target.value as Difficulty)}>
              {difficulties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <button type="button" className="ms-primary-button" onClick={onStart}>
            Start Sweep
          </button>
          <button type="button" onClick={onViewScores}>
            Scores & History
          </button>
        </div>
      </div>

      <div className="ms-landing-stats">
        <article className="ms-landing-card">
          <span>Wins</span>
          <strong>{stats.wins}</strong>
        </article>
        <article className="ms-landing-card">
          <span>Losses</span>
          <strong>{stats.losses}</strong>
        </article>
        <article className="ms-landing-card">
          <span>Current Streak</span>
          <strong>{stats.streak}</strong>
        </article>
        <article className="ms-landing-card">
          <span>Best Streak</span>
          <strong>{stats.bestStreak}</strong>
        </article>
      </div>
    </section>
  )
}