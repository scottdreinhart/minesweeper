// AI / hint system for Minesweeper
import type { Board, Cell } from './types'

const HINT_STATE_HIDDEN = 0
const HINT_STATE_FLAGGED = 1
const HINT_STATE_REVEALED = 2
const HINT_STATE_MASK = 0b11
const HINT_MINE_BIT = 0b100
const HINT_ADJACENT_SHIFT = 3
const HINT_ADJACENT_MASK = 0b1111

export interface HintCell {
  row: number
  col: number
}

function encodeCell(cell: Cell): number {
  const state =
    cell.state === 'hidden'
      ? HINT_STATE_HIDDEN
      : cell.state === 'flagged'
        ? HINT_STATE_FLAGGED
        : HINT_STATE_REVEALED

  return state | (cell.mine ? HINT_MINE_BIT : 0) | (cell.adjacentMines << HINT_ADJACENT_SHIFT)
}

export function encodeBoardForHint(board: Board): Int32Array {
  const encoded = new Int32Array(board.length * (board[0]?.length ?? 0))
  let index = 0

  for (const row of board) {
    for (const cell of row) {
      encoded[index++] = encodeCell(cell)
    }
  }

  return encoded
}

export function decodeHintIndex(index: number, cols: number): HintCell | null {
  if (index < 0 || cols <= 0) {
    return null
  }

  return {
    row: Math.floor(index / cols),
    col: index % cols,
  }
}

export function findSafeCellIndexInEncodedCells(cells: ArrayLike<number>): number {
  let bestIndex = -1
  let bestAdjacent = Number.POSITIVE_INFINITY

  for (let index = 0; index < cells.length; index++) {
    const encoded = cells[index]
    const state = encoded & HINT_STATE_MASK
    const mine = (encoded & HINT_MINE_BIT) !== 0
    if (state !== HINT_STATE_HIDDEN || mine) {
      continue
    }

    const adjacent = (encoded >> HINT_ADJACENT_SHIFT) & HINT_ADJACENT_MASK
    if (adjacent < bestAdjacent) {
      bestIndex = index
      bestAdjacent = adjacent

      if (adjacent === 0) {
        return index
      }
    }
  }

  return bestIndex
}

export function findSafeCell(board: Board): HintCell | null {
  const cols = board[0]?.length ?? 0
  const index = findSafeCellIndexInEncodedCells(encodeBoardForHint(board))
  return decodeHintIndex(index, cols)
}
