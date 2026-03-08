// AI / hint system for Minesweeper
import type { Board } from './types'

export function findSafeCell(board: Board): { row: number; col: number } | null {
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === 'hidden' && !cell.mine) {
        return { row: cell.row, col: cell.col }
      }
    }
  }
  return null
}
