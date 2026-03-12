// Game rules: reveal, flag, win/loss detection
import { DIRECTIONS } from './constants'
import type { Board, GameState } from './types'

export function revealCell(board: Board, row: number, col: number): Board {
  const clone = board.map((r) => r.map((c) => ({ ...c })))
  const cell = clone[row][col]
  if (cell.state !== 'hidden') {
    return clone
  }
  cell.state = 'revealed'
  if (cell.adjacentMines === 0 && !cell.mine) {
    for (const [dr, dc] of DIRECTIONS) {
      const nr = row + dr,
        nc = col + dc
      if (nr >= 0 && nr < clone.length && nc >= 0 && nc < clone[0].length) {
        revealCell(clone, nr, nc)
      }
    }
  }
  return clone
}

export function toggleFlag(board: Board, row: number, col: number): Board {
  const clone = board.map((r) => r.map((c) => ({ ...c })))
  const cell = clone[row][col]
  if (cell.state === 'hidden') {
    cell.state = 'flagged'
  } else if (cell.state === 'flagged') {
    cell.state = 'hidden'
  }
  return clone
}

export function checkWin(state: GameState): boolean {
  const totalSafe = state.rows * state.cols - state.mines
  return state.revealedCount === totalSafe
}

export function checkLoss(board: Board, row: number, col: number): boolean {
  return board[row][col].mine
}
