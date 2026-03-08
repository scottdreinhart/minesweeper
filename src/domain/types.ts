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
