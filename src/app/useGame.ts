import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  DIFFICULTY_PRESETS,
  checkLoss,
  checkWin,
  chordCell,
  createEmptyBoard,
  revealCell,
  toggleFlag,
  type Board,
  type Difficulty,
  type GameState,
} from '@/domain'

import { placeMinesWithEngine } from './minePlacementEngine'
import { useStats } from './useStats'

const DEFAULT_DIFFICULTY: Difficulty = 'beginner'

const createGameState = (difficulty: Difficulty): GameState => {
  const preset = DIFFICULTY_PRESETS[difficulty]
  const board = createEmptyBoard(preset.rows, preset.cols)
  return {
    board,
    status: 'idle',
    rows: preset.rows,
    cols: preset.cols,
    mines: preset.mines,
    flagsPlaced: 0,
    revealedCount: 0,
    startTime: null,
    endTime: null,
  }
}

const countFlags = (board: Board): number => board.flat().filter((cell) => cell.state === 'flagged').length

const countRevealedSafeCells = (board: Board): number =>
  board.flat().filter((cell) => cell.state === 'revealed' && !cell.mine).length

const isBoardSolved = (board: Board): boolean =>
  board.flat().every((cell) => (cell.mine ? cell.state === 'flagged' || cell.state === 'revealed' : cell.state === 'revealed'))

const revealAllMines = (board: Board): Board =>
  board.map((row) => row.map((cell) => (cell.mine ? { ...cell, state: 'revealed' } : cell)))

export function useGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY)
  const [game, setGame] = useState<GameState>(() => createGameState(DEFAULT_DIFFICULTY))
  const [clockTick, setClockTick] = useState(0)
  const { stats, recordLoss, recordWin, resetStats } = useStats()
  const previousStatus = useRef<GameState['status']>('idle')

  useEffect(() => {
    if (game.status !== 'playing' || !game.startTime) {
      return
    }

    const interval = window.setInterval(() => {
      setClockTick((tick) => tick + 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [game.status, game.startTime])

  useEffect(() => {
    const prev = previousStatus.current
    if (prev !== game.status) {
      const durationSeconds =
        game.startTime && game.endTime ? Math.max(0, Math.floor((game.endTime - game.startTime) / 1000)) : 0
      if (game.status === 'won') {
        recordWin({ difficulty, durationSeconds })
      } else if (game.status === 'lost') {
        recordLoss({ difficulty, durationSeconds })
      }
      previousStatus.current = game.status
    }
  }, [difficulty, game.endTime, game.startTime, game.status, recordLoss, recordWin])

  const resetGame = useCallback(
    (nextDifficulty: Difficulty = difficulty) => {
      const nextState = createGameState(nextDifficulty)
      previousStatus.current = nextState.status
      setGame(nextState)
    },
    [difficulty],
  )

  const changeDifficulty = useCallback((nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty)
    const nextState = createGameState(nextDifficulty)
    previousStatus.current = nextState.status
    setGame(nextState)
  }, [])

  const reveal = useCallback((row: number, col: number) => {
    setGame((current) => {
      if (current.status === 'won' || current.status === 'lost') {
        return current
      }

      const clickedCell = current.board[row][col]
      if (!clickedCell || clickedCell.state === 'flagged' || clickedCell.state === 'revealed') {
        return current
      }

      const now = Date.now()
      const boardWithMines =
        current.status === 'idle' ? placeMinesWithEngine(current.board, current.mines, row, col) : current.board
      const revealedBoard = revealCell(boardWithMines, row, col)

      if (checkLoss(revealedBoard, row, col)) {
        const mineBoard = revealAllMines(revealedBoard)
        return {
          ...current,
          board: mineBoard,
          status: 'lost',
          flagsPlaced: countFlags(mineBoard),
          revealedCount: countRevealedSafeCells(mineBoard),
          startTime: current.startTime ?? now,
          endTime: now,
        }
      }

      const nextRevealedCount = countRevealedSafeCells(revealedBoard)
      const nextFlags = countFlags(revealedBoard)
      const tentative: GameState = {
        ...current,
        board: revealedBoard,
        status: 'playing',
        flagsPlaced: nextFlags,
        revealedCount: nextRevealedCount,
        startTime: current.startTime ?? now,
        endTime: null,
      }

      if (checkWin(tentative)) {
        return {
          ...tentative,
          status: 'won',
          endTime: now,
        }
      }

      return tentative
    })
  }, [])

  const toggleCellFlag = useCallback((row: number, col: number) => {
    setGame((current) => {
      if (current.status === 'won' || current.status === 'lost') {
        return current
      }

      const targetCell = current.board[row][col]
      if (!targetCell || targetCell.state === 'revealed') {
        return current
      }

      const nextBoard = toggleFlag(current.board, row, col)
      const tentative: GameState = {
        ...current,
        board: nextBoard,
        flagsPlaced: countFlags(nextBoard),
      }

      if (checkWin(tentative) || isBoardSolved(nextBoard)) {
        return {
          ...tentative,
          status: 'won',
          endTime: Date.now(),
        }
      }

      return tentative
    })
  }, [])

  const submitBoard = useCallback((): boolean => {
    let solved = false
    setGame((current) => {
      if (current.status === 'won' || current.status === 'lost') {
        solved = current.status === 'won'
        return current
      }

      const now = Date.now()
      const tentative: GameState = {
        ...current,
        flagsPlaced: countFlags(current.board),
        revealedCount: countRevealedSafeCells(current.board),
      }

      if (checkWin(tentative) || isBoardSolved(current.board)) {
        solved = true
        return {
          ...tentative,
          status: 'won',
          startTime: tentative.startTime ?? now,
          endTime: now,
        }
      }

      solved = false
      return tentative
    })

    return solved
  }, [])

  const chord = useCallback((row: number, col: number) => {
    setGame((current) => {
      if (current.status !== 'playing') {
        return current
      }

      const now = Date.now()
      const nextBoard = chordCell(current.board, row, col)
      const mineRevealed = nextBoard.flat().some((cell) => cell.mine && cell.state === 'revealed')

      if (mineRevealed) {
        const mineBoard = revealAllMines(nextBoard)
        return {
          ...current,
          board: mineBoard,
          status: 'lost',
          flagsPlaced: countFlags(mineBoard),
          revealedCount: countRevealedSafeCells(mineBoard),
          endTime: now,
        }
      }

      const nextRevealedCount = countRevealedSafeCells(nextBoard)
      const nextFlags = countFlags(nextBoard)
      const tentative: GameState = {
        ...current,
        board: nextBoard,
        flagsPlaced: nextFlags,
        revealedCount: nextRevealedCount,
      }

      if (checkWin(tentative)) {
        return {
          ...tentative,
          status: 'won',
          endTime: now,
        }
      }

      return tentative
    })
  }, [])

  const elapsedSeconds = useMemo(() => {
    if (!game.startTime) {
      return 0
    }
    const end = game.endTime ?? Date.now()
    return Math.max(0, Math.floor((end - game.startTime) / 1000))
  }, [clockTick, game.endTime, game.startTime])

  return {
    game,
    difficulty,
    stats,
    elapsedSeconds,
    reveal,
    chord,
    submitBoard,
    toggleCellFlag,
    resetGame,
    changeDifficulty,
    resetStats,
  }
}
