import type { GameStats } from '@/domain'

interface ScoresScreenProps {
  stats: GameStats
  onBack: () => void
  onStart: () => void
}

export function ScoresScreen({ stats, onBack, onStart }: ScoresScreenProps) {
  const history = Array.isArray(stats.history) ? stats.history : []

  return (
    <section className="ms-scores-screen" aria-label="scores-history-screen">
      <div className="ms-scores-header">
        <div>
          <p className="ms-kicker">Archive</p>
          <h1>Scores & History</h1>
        </div>
        <div className="ms-menu-actions">
          <button type="button" onClick={onBack}>
            Back
          </button>
          <button type="button" className="ms-primary-button" onClick={onStart}>
            Start Run
          </button>
        </div>
      </div>

      <div className="ms-scoreboard">
        <article className="ms-scorecard">
          <span>Wins</span>
          <strong>{stats.wins}</strong>
        </article>
        <article className="ms-scorecard">
          <span>Losses</span>
          <strong>{stats.losses}</strong>
        </article>
        <article className="ms-scorecard">
          <span>Current Streak</span>
          <strong>{stats.streak}</strong>
        </article>
        <article className="ms-scorecard">
          <span>Best Streak</span>
          <strong>{stats.bestStreak}</strong>
        </article>
      </div>

      <div className="ms-history-list">
        {history.length === 0 ? (
          <p className="ms-history-empty">No finished runs yet.</p>
        ) : (
          history.map((entry, index) => (
            <article key={`${entry.timestamp}-${index}`} className="ms-history-card">
              <div>
                <p className="ms-kicker">{entry.outcome === 'won' ? 'Cleared' : 'Detonated'}</p>
                <strong>{entry.difficulty}</strong>
              </div>
              <div className="ms-history-meta">
                <span>{entry.durationSeconds}s</span>
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}