import { placeMines, type Board } from '@/domain'
import { getMinesweeperWasmSync } from '@/wasm/minesweeper-wasm'

const MINE_BIT = 0b100
const ADJACENT_SHIFT = 3
const ADJACENT_MASK = 0b1111

function createSeed(): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    return crypto.getRandomValues(new Uint32Array(1))[0] ?? Date.now()
  }

  return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0
}

export function placeMinesWithEngine(
  board: Board,
  count: number,
  safeRow: number,
  safeCol: number,
  seed = createSeed(),
): Board {
  const rows = board.length
  const cols = board[0]?.length ?? 0
  const length = rows * cols
  const safeIndex = safeRow * cols + safeCol
  const wasm = getMinesweeperWasmSync()

  if (!wasm || cols === 0) {
    return placeMines(board, count, safeRow, safeCol)
  }

  const clone = board.map((row) => row.map((cell) => ({ ...cell, mine: false, adjacentMines: 0 })))
  for (let index = 0; index < length; index++) {
    wasm.setCell(index, 0)
  }

  const placedCount = wasm.generateMinePositions(length, count, safeIndex, seed >>> 0)

  for (let index = 0; index < placedCount; index++) {
    const mineIndex = wasm.getMinePosition(index)
    if (mineIndex < 0) {
      continue
    }

    wasm.setCell(mineIndex, MINE_BIT)
  }

  wasm.computeAdjacency(length, cols)

  for (let index = 0; index < length; index++) {
    const encoded = wasm.getCell(index)
    const row = Math.floor(index / cols)
    const col = index % cols
    clone[row][col].mine = (encoded & MINE_BIT) !== 0
    clone[row][col].adjacentMines = (encoded >> ADJACENT_SHIFT) & ADJACENT_MASK
  }

  return clone
}