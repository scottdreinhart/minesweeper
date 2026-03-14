// Game rules: reveal, flag, win/loss detection
import { DIRECTIONS } from './constants'
import type { Board, GameState } from './types'

function inBounds(board: Board, row: number, col: number): boolean {
  return row >= 0 && row < board.length && col >= 0 && col < board[0].length
}

function revealFrom(board: Board, row: number, col: number): void {
  if (!inBounds(board, row, col)) {
    return
  }

  const start = board[row][col]
  if (start.state !== 'hidden') {
    return
  }

  if (start.mine) {
    start.state = 'revealed'
    return
  }

  const stack: Array<[number, number]> = [[row, col]]

  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop() as [number, number]
    const cell = board[currentRow][currentCol]

    if (cell.state !== 'hidden' || cell.mine) {
      continue
    }

    cell.state = 'revealed'

    if (cell.adjacentMines !== 0) {
      continue
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = currentRow + dr
      const nc = currentCol + dc
      if (!inBounds(board, nr, nc)) {
        continue
      }
      const neighbor = board[nr][nc]
      if (neighbor.state === 'hidden' && !neighbor.mine) {
        stack.push([nr, nc])
      }
    }
  }
}

export function revealCell(board: Board, row: number, col: number): Board {
  const clone = board.map((r) => r.map((c) => ({ ...c })))
  revealFrom(clone, row, col)
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

export function chordCell(board: Board, row: number, col: number): Board {
  const clone = board.map((r) => r.map((c) => ({ ...c })))
  if (!inBounds(clone, row, col)) {
    return clone
  }

  const cell = clone[row][col]
  if (cell.state !== 'revealed' || cell.adjacentMines === 0) {
    return clone
  }

  let adjacentFlags = 0
  for (const [dr, dc] of DIRECTIONS) {
    const nr = row + dr
    const nc = col + dc
    if (inBounds(clone, nr, nc) && clone[nr][nc].state === 'flagged') {
      adjacentFlags++
    }
  }

  if (adjacentFlags !== cell.adjacentMines) {
    return clone
  }

  for (const [dr, dc] of DIRECTIONS) {
    const nr = row + dr
    const nc = col + dc
    if (!inBounds(clone, nr, nc)) {
      continue
    }
    const neighbor = clone[nr][nc]
    if (neighbor.state === 'hidden') {
      revealFrom(clone, nr, nc)
    }
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
