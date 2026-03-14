import { COLOR_THEMES, COLORBLIND_MODES, MODES, type Difficulty, type GameStats } from '@/domain'

interface HamburgerMenuProps {
  open: boolean
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  colorTheme: string
  onColorThemeChange: (theme: string) => void
  mode: string
  onModeChange: (mode: string) => void
  colorblind: string
  onColorblindChange: (value: string) => void
  soundEnabled: boolean
  onToggleSound: () => void
  onResetStats: () => void
  onNewGame: () => void
  onHome: () => void
  onViewScores: () => void
  onHint: () => void
  onDone: () => void
  hintDisabled: boolean
  doneDisabled: boolean
  stats: GameStats
  difficulties: readonly Difficulty[]
}

export function HamburgerMenu({
  open,
  difficulty,
  onDifficultyChange,
  colorTheme,
  onColorThemeChange,
  mode,
  onModeChange,
  colorblind,
  onColorblindChange,
  soundEnabled,
  onToggleSound,
  onResetStats,
  onNewGame,
  onHome,
  onViewScores,
  onHint,
  onDone,
  hintDisabled,
  doneDisabled,
  stats,
  difficulties,
}: HamburgerMenuProps) {
  return (
    <aside className={`ms-menu${open ? ' ms-menu-open' : ''}`} aria-label="settings-and-scores">
      <div className="ms-menu-panel">
        <section className="ms-menu-section">
          <p className="ms-kicker">Controls</p>
          <div className="ms-menu-actions">
            <button type="button" onClick={onNewGame}>
              New Game
            </button>
            <button type="button" onClick={onHint} disabled={hintDisabled}>
              Hint
            </button>
            <button type="button" onClick={onDone} disabled={doneDisabled}>
              Done Check
            </button>
            <button type="button" onClick={onHome}>
              Landing Page
            </button>
            <button type="button" onClick={onViewScores}>
              Scores Screen
            </button>
          </div>
        </section>

        <section className="ms-menu-section">
          <p className="ms-kicker">Settings</p>
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
          <label className="ms-field">
            <span>Theme</span>
            <select value={colorTheme} onChange={(event) => onColorThemeChange(event.target.value)}>
              {COLOR_THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.label}
                </option>
              ))}
            </select>
          </label>
          <label className="ms-field">
            <span>Mode</span>
            <select value={mode} onChange={(event) => onModeChange(event.target.value)}>
              {MODES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="ms-field">
            <span>Color Assist</span>
            <select value={colorblind} onChange={(event) => onColorblindChange(event.target.value)}>
              {COLORBLIND_MODES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={onToggleSound}>
            Sound: {soundEnabled ? 'On' : 'Off'}
          </button>
        </section>

        <section className="ms-menu-section">
          <p className="ms-kicker">Scores</p>
          <div className="ms-menu-scores">
            <p>Wins: {stats.wins}</p>
            <p>Losses: {stats.losses}</p>
            <p>Current Streak: {stats.streak}</p>
            <p>Best Streak: {stats.bestStreak}</p>
          </div>
          <button type="button" onClick={onResetStats}>
            Reset Scores
          </button>
        </section>
      </div>
    </aside>
  )
}