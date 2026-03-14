import { decodeHintIndex, encodeBoardForHint, findSafeCell, findSafeCellIndexInEncodedCells, type Board, type HintCell } from '@/domain'
import { ensureMinesweeperWasmReady, getMinesweeperWasmSync } from '@/wasm/minesweeper-wasm'

export interface HintResult extends HintCell {
  engine: 'wasm' | 'js'
}

interface HintWorkerRequest {
  id: number
  cells: number[]
  cols: number
}

interface HintWorkerResponse {
  id: number
  index: number
  cols: number
  engine: 'wasm' | 'js'
}

let worker: Worker | null = null
let workerRequestId = 0
const pendingRequests = new Map<number, (value: HintResult | null) => void>()

function mapIndexToHint(index: number, cols: number, engine: 'wasm' | 'js'): HintResult | null {
  const hint = decodeHintIndex(index, cols)
  return hint ? { ...hint, engine } : null
}

function runWasmHint(board: Board): HintResult | null {
  const exports = getMinesweeperWasmSync()
  if (!exports) {
    return null
  }

  const encoded = encodeBoardForHint(board)
  for (let index = 0; index < encoded.length; index++) {
    exports.setCell(index, encoded[index])
  }

  return mapIndexToHint(exports.findSafeCell(encoded.length), board[0]?.length ?? 0, 'wasm')
}

function runJsHint(board: Board): HintResult | null {
  const hint = findSafeCell(board)
  return hint ? { ...hint, engine: 'js' } : null
}

export function computeAiMove(board: Board): HintResult | null {
  const wasmResult = runWasmHint(board)
  if (wasmResult) {
    return wasmResult
  }

  return runJsHint(board)
}

export async function ensureWasmReady(): Promise<void> {
  await ensureMinesweeperWasmReady()
}

function getWorker(): Worker | null {
  if (typeof Worker === 'undefined') {
    return null
  }

  if (!worker) {
    worker = new Worker(new URL('../workers/ai.worker.ts', import.meta.url), { type: 'module' })
    worker.addEventListener('message', (event: MessageEvent<HintWorkerResponse>) => {
      const resolve = pendingRequests.get(event.data.id)
      if (!resolve) {
        return
      }

      pendingRequests.delete(event.data.id)
      resolve(mapIndexToHint(event.data.index, event.data.cols ?? 0, event.data.engine))
    })
    worker.addEventListener('error', () => {
      for (const [id, resolve] of pendingRequests) {
        pendingRequests.delete(id)
        resolve(null)
      }
      worker?.terminate()
      worker = null
    })
  }

  return worker
}

export async function computeAiMoveAsync(board: Board): Promise<HintResult | null> {
  const aiWorker = getWorker()
  if (!aiWorker) {
    return computeAiMove(board)
  }

  const encoded = Array.from(encodeBoardForHint(board))
  const id = ++workerRequestId
  const request: HintWorkerRequest = {
    id,
    cells: encoded,
    cols: board[0]?.length ?? 0,
  }

  return new Promise((resolve) => {
    pendingRequests.set(id, (result) => {
      resolve(result ?? mapIndexToHint(findSafeCellIndexInEncodedCells(encoded), request.cols, 'js'))
    })
    aiWorker.postMessage(request)
  })
}

export function terminateAsyncAi(): void {
  if (worker) {
    worker.terminate()
    worker = null
  }

  for (const [id, resolve] of pendingRequests) {
    pendingRequests.delete(id)
    resolve(null)
  }
}