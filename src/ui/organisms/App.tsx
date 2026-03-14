import { type Difficulty } from '@/domain'
import {
  computeAiMoveAsync,
  ensureWasmReady,
  terminateAsyncAi,
  useGame,
  useKeyboardControls,
  useSoundContext,
  useThemeContext,
} from '@/app'
import { GameBoard, HamburgerMenu, Hud, LandingPage, ScoresScreen, SplashScreen } from '@/ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'expert']

export function App() {
  const { settings, setColorTheme, setColorblind, setMode } = useThemeContext()
  const { click, reveal: revealSound, explosion, soundEnabled, toggleSound, win } = useSoundContext()
  const {
    changeDifficulty,
    chord,
    difficulty,
    elapsedSeconds,
    game,
    resetGame,
    resetStats,
    reveal,
    submitBoard,
    stats,
    toggleCellFlag,
  } = useGame()

  const previousStatus = useRef(game.status)
  const [hint, setHint] = useState<{ row: number; col: number; engine: 'wasm' | 'js' } | null>(null)
  const [hintPending, setHintPending] = useState(false)
  const [hintRequested, setHintRequested] = useState(false)
  const [screen, setScreen] = useState<'splash' | 'landing' | 'game' | 'scores'>('splash')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 })
  const [doneFeedback, setDoneFeedback] = useState<string | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setScreen('landing')
    }, 1200)

    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (previousStatus.current !== game.status) {
      if (game.status === 'won') {
        win()
      } else if (game.status === 'lost') {
        explosion()
      }
      previousStatus.current = game.status
    }
  }, [explosion, game.status, win])

  useEffect(() => {
    void ensureWasmReady()
    return () => terminateAsyncAi()
  }, [])

  useEffect(() => {
    setHint(null)
    setHintRequested(false)
    setSelectedCell((current) => ({
      row: Math.min(current.row, Math.max(0, game.rows - 1)),
      col: Math.min(current.col, Math.max(0, game.cols - 1)),
    }))
  }, [difficulty, game.board, game.status])

  const mineCounter = useMemo(() => game.mines - game.flagsPlaced, [game.flagsPlaced, game.mines])
  const difficultyLabel = useMemo(() => difficulty[0].toUpperCase() + difficulty.slice(1), [difficulty])
  const hintLabel = useMemo(() => {
    if (hint) {
      return `Hint ready: row ${hint.row + 1}, col ${hint.col + 1} via ${hint.engine.toUpperCase()}`
    }

    if (hintPending) {
      return 'Analyzing safest path…'
    }

    if (hintRequested) {
      return 'No safe move available'
    }

    return 'Keyboard: Arrows/WASD move, Enter reveal, F flag, C chord, X done-check, H hint'
  }, [hint, hintPending, hintRequested])

  const doneCheck = useCallback(() => {
    const solved = submitBoard()
    setDoneFeedback(solved ? 'Board validated: win confirmed.' : 'Not complete yet — keep clearing safe tiles.')
  }, [submitBoard])

  const moveSelection = useCallback(
    (dr: number, dc: number) => {
      setSelectedCell((current) => ({
        row: Math.max(0, Math.min(game.rows - 1, current.row + dr)),
        col: Math.max(0, Math.min(game.cols - 1, current.col + dc)),
      }))
    },
    [game.cols, game.rows],
  )

  const requestHint = useCallback(async () => {
    if (hintPending || game.status === 'won' || game.status === 'lost') {
      return
    }

    setHintPending(true)
    setHintRequested(true)

    try {
      const nextHint = await computeAiMoveAsync(game.board)
      setHint(nextHint)
    } finally {
      setHintPending(false)
    }
  }, [game.board, game.status, hintPending])

  const startGame = useCallback(() => {
    resetGame()
    setScreen('game')
    setMenuOpen(false)
  }, [resetGame])

  const goHome = useCallback(() => {
    setScreen('landing')
    setMenuOpen(false)
  }, [])

  const openScores = useCallback(() => {
    setScreen('scores')
    setMenuOpen(false)
  }, [])

  const keyboardBindings = useMemo(
    () => [
      {
        action: 'hint',
        keys: ['KeyH'],
        onTrigger: () => void requestHint(),
        enabled: () => screen === 'game',
      },
      {
        action: 'move-up',
        keys: ['ArrowUp', 'KeyW'],
        onTrigger: () => moveSelection(-1, 0),
        enabled: () => screen === 'game',
      },
      {
        action: 'move-down',
        keys: ['ArrowDown', 'KeyS'],
        onTrigger: () => moveSelection(1, 0),
        enabled: () => screen === 'game',
      },
      {
        action: 'move-left',
        keys: ['ArrowLeft', 'KeyA'],
        onTrigger: () => moveSelection(0, -1),
        enabled: () => screen === 'game',
      },
      {
        action: 'move-right',
        keys: ['ArrowRight', 'KeyD'],
        onTrigger: () => moveSelection(0, 1),
        enabled: () => screen === 'game',
      },
      {
        action: 'reveal',
        keys: ['Enter'],
        onTrigger: () => {
          setSelectedCell({ row: selectedCell.row, col: selectedCell.col })
          click()
          reveal(selectedCell.row, selectedCell.col)
          revealSound()
          setDoneFeedback(null)
        },
        enabled: () => screen === 'game',
      },
      {
        action: 'flag',
        keys: ['KeyF'],
        onTrigger: () => {
          setSelectedCell({ row: selectedCell.row, col: selectedCell.col })
          click()
          toggleCellFlag(selectedCell.row, selectedCell.col)
          setDoneFeedback(null)
        },
        enabled: () => screen === 'game',
      },
      {
        action: 'chord',
        keys: ['KeyC'],
        onTrigger: () => {
          setSelectedCell({ row: selectedCell.row, col: selectedCell.col })
          click()
          chord(selectedCell.row, selectedCell.col)
          setDoneFeedback(null)
        },
        enabled: () => screen === 'game',
      },
      {
        action: 'done-check',
        keys: ['KeyX'],
        onTrigger: () => doneCheck(),
        enabled: () => screen === 'game',
      },
      {
        action: 'toggle-menu',
        keys: ['KeyM'],
        onTrigger: () => setMenuOpen((current) => !current),
      },
      {
        action: 'close-menu',
        keys: ['Escape'],
        onTrigger: () => setMenuOpen(false),
      },
    ],
    [
      chord,
      click,
      doneCheck,
      moveSelection,
      requestHint,
      reveal,
      revealSound,
      screen,
      selectedCell.col,
      selectedCell.row,
      toggleCellFlag,
    ],
  )

  useKeyboardControls(keyboardBindings)

  const onReveal = (row: number, col: number) => {
    setSelectedCell({ row, col })
    click()
    reveal(row, col)
    revealSound()
    setDoneFeedback(null)
  }

  const onToggleFlag = (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => {
    setSelectedCell({ row, col })
    event.preventDefault()
    click()
    toggleCellFlag(row, col)
    setDoneFeedback(null)
  }

  const onChord = (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => {
    if (event.detail < 2) {
      return
    }
    setSelectedCell({ row, col })
    click()
    chord(row, col)
    setDoneFeedback(null)
  }

  if (screen === 'splash') {
    return <SplashScreen />
  }

  if (screen === 'landing') {
    return (
      <main className="ms-shell">
        <LandingPage
          difficulty={difficulty}
          difficulties={DIFFICULTIES}
          onDifficultyChange={changeDifficulty}
          onStart={startGame}
          onViewScores={openScores}
          stats={stats}
        />
      </main>
    )
  }

  if (screen === 'scores') {
    return (
      <main className="ms-shell">
        <ScoresScreen stats={stats} onBack={goHome} onStart={startGame} />
      </main>
    )
  }

  return (
    <main className="ms-shell">
      <div className="ms-app">
        <header className="ms-topbar">
          <div>
            <p className="ms-kicker">Mission Control</p>
            <h1>Minesweeper</h1>
          </div>
          <button
            type="button"
            className={`ms-hamburger${menuOpen ? ' ms-hamburger-open' : ''}`}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="toggle-menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        <Hud
          minesRemaining={mineCounter}
          elapsedSeconds={elapsedSeconds}
          status={game.status}
          stats={stats}
          difficultyLabel={difficultyLabel}
          hintLabel={doneFeedback ?? hintLabel}
        />

        <HamburgerMenu
          open={menuOpen}
          difficulty={difficulty}
          difficulties={DIFFICULTIES}
          onDifficultyChange={changeDifficulty}
          colorTheme={settings.colorTheme}
          onColorThemeChange={setColorTheme}
          mode={settings.mode}
          onModeChange={setMode}
          colorblind={settings.colorblind}
          onColorblindChange={setColorblind}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onResetStats={resetStats}
          onNewGame={startGame}
          onHome={goHome}
          onViewScores={openScores}
          onHint={() => void requestHint()}
          onDone={doneCheck}
          hintDisabled={hintPending || game.status === 'won' || game.status === 'lost'}
          doneDisabled={game.status === 'won' || game.status === 'lost'}
          stats={stats}
        />

        {menuOpen ? <button type="button" className="ms-menu-backdrop" aria-label="close-menu" onClick={() => setMenuOpen(false)} /> : null}

        <section className="ms-board-shell">
          <GameBoard
            board={game.board}
            cols={game.cols}
            hint={hint}
            selected={selectedCell}
            disabled={game.status === 'won' || game.status === 'lost'}
            onReveal={onReveal}
            onToggleFlag={onToggleFlag}
            onChord={onChord}
          />
        </section>
      </div>
    </main>
  )
}
