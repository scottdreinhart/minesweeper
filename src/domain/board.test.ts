import { describe, expect, it } from 'vitest'
import { createEmptyBoard, toggleFlag } from '@/domain'

describe('domain/board', () => {
  it('creates an empty board with expected dimensions', () => {
    const board = createEmptyBoard(3, 4)
    expect(board).toHaveLength(3)
    expect(board[0]).toHaveLength(4)
    expect(board[2][3].row).toBe(2)
    expect(board[2][3].col).toBe(3)
    expect(board[2][3].mine).toBe(false)
    expect(board[2][3].state).toBe('hidden')
  })

  it('toggles a cell flag state hidden -> flagged -> hidden', () => {
    const board = createEmptyBoard(2, 2)
    const flagged = toggleFlag(board, 0, 0)
    expect(flagged[0][0].state).toBe('flagged')

    const unflagged = toggleFlag(flagged, 0, 0)
    expect(unflagged[0][0].state).toBe('hidden')
  })
})
