/**
 * useStats — win/loss/streak tracking persisted to localStorage.
 */

import { useCallback, useState } from 'react'

import { DEFAULT_STATS } from '@/domain/constants'
import type { Difficulty, GameHistoryEntry, GameStats } from '@/domain/types'

import { logCrash } from './crashLogger.ts'
import { load, save } from './storageService'

const STORAGE_KEY = 'minesweeper-stats'

interface GameResultContext {
  difficulty: Difficulty
  durationSeconds: number
}

const HISTORY_LIMIT = 12

function normalizeStats(raw: GameStats): GameStats {
  return {
    wins: Number.isFinite(raw.wins) ? raw.wins : DEFAULT_STATS.wins,
    losses: Number.isFinite(raw.losses) ? raw.losses : DEFAULT_STATS.losses,
    streak: Number.isFinite(raw.streak) ? raw.streak : DEFAULT_STATS.streak,
    bestStreak: Number.isFinite(raw.bestStreak) ? raw.bestStreak : DEFAULT_STATS.bestStreak,
    history: Array.isArray(raw.history)
      ? raw.history
          .filter((entry) => entry && typeof entry === 'object')
          .map((entry) => {
            const outcome: GameHistoryEntry['outcome'] = entry.outcome === 'won' ? 'won' : 'lost'
            return {
              outcome,
              difficulty: entry.difficulty,
              durationSeconds: Number.isFinite(entry.durationSeconds) ? entry.durationSeconds : 0,
              timestamp: Number.isFinite(entry.timestamp) ? entry.timestamp : Date.now(),
            }
          })
          .slice(0, HISTORY_LIMIT)
      : [],
  }
}

function appendHistory(
  stats: GameStats,
  outcome: GameHistoryEntry['outcome'],
  context: GameResultContext,
): GameHistoryEntry[] {
  const entry: GameHistoryEntry = {
    outcome,
    difficulty: context.difficulty,
    durationSeconds: context.durationSeconds,
    timestamp: Date.now(),
  }

  const existing = Array.isArray(stats.history) ? stats.history : []
  return [entry, ...existing].slice(0, HISTORY_LIMIT)
}

export function useStats() {
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      return normalizeStats(load(STORAGE_KEY, DEFAULT_STATS))
    } catch (error) {
      logCrash('useStats.init', error)
      return DEFAULT_STATS
    }
  })

  const recordWin = useCallback((context: GameResultContext) => {
    setStats((prev) => {
      try {
        const next: GameStats = {
          wins: prev.wins + 1,
          losses: prev.losses,
          streak: prev.streak + 1,
          bestStreak: Math.max(prev.bestStreak, prev.streak + 1),
          history: appendHistory(prev, 'won', context),
        }
        save(STORAGE_KEY, next)
        return next
      } catch (error) {
        logCrash('useStats.recordWin', error, { prev, context })
        return normalizeStats(prev)
      }
    })
  }, [])

  const recordLoss = useCallback((context: GameResultContext) => {
    setStats((prev) => {
      try {
        const next: GameStats = {
          wins: prev.wins,
          losses: prev.losses + 1,
          streak: 0,
          bestStreak: prev.bestStreak,
          history: appendHistory(prev, 'lost', context),
        }
        save(STORAGE_KEY, next)
        return next
      } catch (error) {
        logCrash('useStats.recordLoss', error, { prev, context })
        return normalizeStats(prev)
      }
    })
  }, [])

  const resetStats = useCallback(() => {
    try {
      save(STORAGE_KEY, DEFAULT_STATS)
      setStats(DEFAULT_STATS)
    } catch (error) {
      logCrash('useStats.resetStats', error)
      setStats(DEFAULT_STATS)
    }
  }, [])

  return { stats, recordWin, recordLoss, resetStats }
}
