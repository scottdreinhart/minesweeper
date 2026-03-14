import { createEmptyBoard } from '@/domain'
import { ensureWasmReady } from './aiEngine'
import { placeMinesWithEngine } from './minePlacementEngine'

describe('minePlacementEngine', () => {
  beforeAll(async () => {
    await ensureWasmReady()
  })

  it('never places a mine on the first-click safe cell', () => {
    const board = createEmptyBoard(9, 9)
    const seeded = placeMinesWithEngine(board, 10, 4, 4, 12345)

    expect(seeded[4][4].mine).toBe(false)
    expect(seeded.flat().filter((cell) => cell.mine)).toHaveLength(10)
  })

  it('produces deterministic placement for a given seed', () => {
    const board = createEmptyBoard(4, 4)
    const first = placeMinesWithEngine(board, 4, 0, 0, 77)
    const second = placeMinesWithEngine(board, 4, 0, 0, 77)

    expect(first.map((row) => row.map((cell) => cell.mine))).toEqual(
      second.map((row) => row.map((cell) => cell.mine)),
    )
  })

  it('computes adjacent mine counts as part of WASM board generation', () => {
    const board = createEmptyBoard(3, 3)
    const seeded = placeMinesWithEngine(board, 2, 1, 1, 5)

    for (let row = 0; row < seeded.length; row++) {
      for (let col = 0; col < seeded[row].length; col++) {
        const cell = seeded[row][col]
        if (cell.mine) {
          continue
        }

        let expected = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) {
              continue
            }

            const nextRow = row + dr
            const nextCol = col + dc
            if (nextRow < 0 || nextRow >= seeded.length || nextCol < 0 || nextCol >= seeded[row].length) {
              continue
            }

            if (seeded[nextRow][nextCol].mine) {
              expected++
            }
          }
        }

        expect(cell.adjacentMines).toBe(expected)
      }
    }
  })
})