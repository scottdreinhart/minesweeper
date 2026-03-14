// Board operations: create, place mines, compute adjacency
import { DIRECTIONS } from './constants'
import type { Board, Cell } from './types'

export function createEmptyBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, (_, row) =>
    Array.from(
      { length: cols },
      (_, col): Cell => ({
        row,
        col,
        mine: false,
        adjacentMines: 0,
        state: 'hidden',
      }),
    ),
  )
}

export function placeMines(board: Board, count: number, safeRow: number, safeCol: number): Board {
  const rows = board.length
  const cols = board[0].length
  const clone = board.map((r) => r.map((c) => ({ ...c })))
  const targetCount = Math.min(count, rows * cols - 1)
  let placed = 0
  while (placed < targetCount) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (!clone[r][c].mine && !(r === safeRow && c === safeCol)) {
      clone[r][c].mine = true
      placed++
    }
  }
  return computeAdjacency(clone)
}

export function computeAdjacency(board: Board): Board {
  const rows = board.length
  const cols = board[0].length
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) {
        continue
      }
      let count = 0
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr,
          nc = c + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
          count++
        }
      }
      board[r][c].adjacentMines = count
    }
  }
  return board
}
