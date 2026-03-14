import { createEmptyBoard } from '@/domain'
import { computeAiMove, computeAiMoveAsync, ensureWasmReady, terminateAsyncAi } from './aiEngine'

function createHintBoard() {
  const board = createEmptyBoard(2, 2)
  board[0][0].state = 'revealed'
  board[0][0].adjacentMines = 1
  board[0][1].state = 'hidden'
  board[0][1].mine = false
  board[0][1].adjacentMines = 0
  board[1][0].state = 'hidden'
  board[1][0].mine = false
  board[1][0].adjacentMines = 2
  board[1][1].state = 'hidden'
  board[1][1].mine = true
  return board
}

describe('aiEngine', () => {
  beforeAll(async () => {
    await ensureWasmReady()
  })

  afterAll(() => {
    terminateAsyncAi()
  })

  it('selects the safest hidden cell on the sync path', () => {
    const result = computeAiMove(createHintBoard())
    expect(result).toEqual({ row: 0, col: 1, engine: expect.any(String) })
  })

  it('matches sync and async hint coordinates', async () => {
    const board = createHintBoard()
    const syncResult = computeAiMove(board)
    const asyncResult = await computeAiMoveAsync(board)

    expect(asyncResult?.row).toBe(syncResult?.row)
    expect(asyncResult?.col).toBe(syncResult?.col)
  })
})