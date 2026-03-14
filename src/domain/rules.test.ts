import { describe, expect, it } from 'vitest'
import {
  checkLoss,
  checkWin,
  chordCell,
  computeAdjacency,
  createEmptyBoard,
  type GameState,
  placeMines,
  revealCell,
  toggleFlag,
} from '@/domain'

describe('domain/rules', () => {
  it('keeps the first-click safe cell free of mines', () => {
    for (let i = 0; i < 40; i++) {
      const base = createEmptyBoard(9, 9)
      const board = placeMines(base, 10, 4, 4)
      expect(board[4][4].mine).toBe(false)
    }
  })

  it('reveals contiguous zero region and bordering numbers', () => {
    const board = createEmptyBoard(3, 3)
    board[0][0].mine = true
    const withAdjacency = computeAdjacency(board)

    const revealed = revealCell(withAdjacency, 2, 2)
    const revealedSafeCells = revealed.flat().filter((cell) => !cell.mine && cell.state === 'revealed').length

    expect(revealedSafeCells).toBe(8)
    expect(revealed[0][0].state).toBe('hidden')
  })

  it('computes win status based on all safe cells revealed', () => {
    const winningState = {
      board: createEmptyBoard(2, 2),
      status: 'won',
      rows: 2,
      cols: 2,
      mines: 1,
      flagsPlaced: 1,
      revealedCount: 3,
      startTime: null,
      endTime: null,
    } satisfies GameState

    const ongoingState = {
      ...winningState,
      status: 'playing',
      revealedCount: 2,
    } satisfies GameState

    expect(checkWin(winningState)).toBe(true)
    expect(checkWin(ongoingState)).toBe(false)
  })

  it('detects loss when a revealed cell has a mine', () => {
    const board = createEmptyBoard(2, 2)
    board[0][0].mine = true

    expect(checkLoss(board, 0, 0)).toBe(true)
    expect(checkLoss(board, 1, 1)).toBe(false)
  })

  it('chords to reveal neighbors when adjacent flags match number', () => {
    const board = createEmptyBoard(2, 2)
    board[0][0].mine = true
    const withAdjacency = computeAdjacency(board)

    const revealed = revealCell(withAdjacency, 1, 1)
    const flagged = toggleFlag(revealed, 0, 0)
    const chorded = chordCell(flagged, 1, 1)

    expect(chorded[0][1].state).toBe('revealed')
    expect(chorded[1][0].state).toBe('revealed')
  })

  it('does not chord when adjacent flag count does not match number', () => {
    const board = createEmptyBoard(2, 2)
    board[0][0].mine = true
    const withAdjacency = computeAdjacency(board)

    const revealed = revealCell(withAdjacency, 1, 1)
    const chorded = chordCell(revealed, 1, 1)

    expect(chorded[0][1].state).toBe('hidden')
    expect(chorded[1][0].state).toBe('hidden')
  })

  it('can reveal an unflagged mine on chord with incorrect flags', () => {
    const board = createEmptyBoard(2, 2)
    board[0][0].mine = true
    const withAdjacency = computeAdjacency(board)

    const revealed = revealCell(withAdjacency, 1, 1)
    const wronglyFlagged = toggleFlag(revealed, 0, 1)
    const chorded = chordCell(wronglyFlagged, 1, 1)

    expect(chorded[0][0].state).toBe('revealed')
    expect(chorded[0][0].mine).toBe(true)
  })
})
