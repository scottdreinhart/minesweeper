// Central type definitions for Minesweeper
export type CellState = 'hidden' | 'revealed' | 'flagged'
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

export interface Cell {
  row: number
  col: number
  mine: boolean
  adjacentMines: number
  state: CellState
}

export type Board = Cell[][]

export interface GameState {
  board: Board
  status: GameStatus
  rows: number
  cols: number
  mines: number
  flagsPlaced: number
  revealedCount: number
  startTime: number | null
  endTime: number | null
}

export type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom'

export interface DifficultyPreset {
  rows: number
  cols: number
  mines: number
}

/** Shared theme types — identical across all games */

export interface ColorTheme {
  readonly id: string
  readonly label: string
  readonly accent: string
}

export interface ColorblindMode {
  readonly id: string
  readonly label: string
  readonly description?: string
}

export interface ThemeSettings {
  colorTheme: string
  mode: string
  colorblind: string
}

export interface GameHistoryEntry {
  outcome: 'won' | 'lost'
  difficulty: Difficulty
  durationSeconds: number
  timestamp: number
}

export interface GameStats {
  wins: number
  losses: number
  streak: number
  bestStreak: number
  history: GameHistoryEntry[]
}
