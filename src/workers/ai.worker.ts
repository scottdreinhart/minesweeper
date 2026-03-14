import { AI_WASM_BASE64 } from '@/wasm/ai-wasm'
import { findSafeCellIndexInEncodedCells } from '@/domain'

interface WasmHintExports {
  setCell: (index: number, value: number) => void
  findSafeCell: (length: number) => number
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

let wasmReadyPromise: Promise<WasmHintExports | null> | null = null

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

async function ensureWorkerWasm(): Promise<WasmHintExports | null> {
  if (!AI_WASM_BASE64) {
    return null
  }

  wasmReadyPromise ??= WebAssembly.instantiate(decodeBase64(AI_WASM_BASE64), {}).then((result) => {
    const { instance } = result as unknown as WebAssembly.WebAssemblyInstantiatedSource
    const exports = instance.exports as Partial<WasmHintExports>
    if (typeof exports.setCell !== 'function' || typeof exports.findSafeCell !== 'function') {
      return null
    }

    return {
      setCell: exports.setCell,
      findSafeCell: exports.findSafeCell,
    }
  }).catch(() => null)

  return wasmReadyPromise
}

self.onmessage = async (event: MessageEvent<HintWorkerRequest>) => {
  const { cells, cols, id } = event.data
  const wasm = await ensureWorkerWasm()

  let index = -1
  let engine: 'wasm' | 'js' = 'js'

  if (wasm) {
    for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      wasm.setCell(cellIndex, cells[cellIndex])
    }
    index = wasm.findSafeCell(cells.length)
    engine = 'wasm'
  } else {
    index = findSafeCellIndexInEncodedCells(cells)
  }

  const response: HintWorkerResponse = { id, index, cols, engine }
  self.postMessage(response)
}
