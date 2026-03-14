import { AI_WASM_BASE64 } from './ai-wasm'

export interface MinesweeperWasmExports {
  setCell: (index: number, value: number) => void
  getCell: (index: number) => number
  findSafeCell: (length: number) => number
  generateMinePositions: (length: number, count: number, safeIndex: number, seed: number) => number
  getMinePosition: (index: number) => number
  computeAdjacency: (length: number, cols: number) => void
}

let wasmExports: MinesweeperWasmExports | null = null
let wasmReadyPromise: Promise<MinesweeperWasmExports | null> | null = null

function decodeBase64(base64: string): Uint8Array {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const NodeBuffer = (globalThis as any).Buffer as { from(s: string, enc: string): ArrayLike<number> } | undefined
  if (NodeBuffer) {
    return Uint8Array.from(NodeBuffer.from(base64, 'base64'))
  }

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

async function instantiateWasm(): Promise<MinesweeperWasmExports | null> {
  if (!AI_WASM_BASE64) {
    return null
  }

  try {
    const bytes = decodeBase64(AI_WASM_BASE64)
    const { instance } = await WebAssembly.instantiate(bytes, {}) as unknown as WebAssembly.WebAssemblyInstantiatedSource
    const exports = instance.exports as Partial<MinesweeperWasmExports>

    if (
      typeof exports.setCell !== 'function' ||
      typeof exports.getCell !== 'function' ||
      typeof exports.findSafeCell !== 'function' ||
      typeof exports.generateMinePositions !== 'function' ||
      typeof exports.getMinePosition !== 'function' ||
      typeof exports.computeAdjacency !== 'function'
    ) {
      return null
    }

    wasmExports = {
      setCell: exports.setCell,
      getCell: exports.getCell,
      findSafeCell: exports.findSafeCell,
      generateMinePositions: exports.generateMinePositions,
      getMinePosition: exports.getMinePosition,
      computeAdjacency: exports.computeAdjacency,
    }
    return wasmExports
  } catch {
    return null
  }
}

export async function ensureMinesweeperWasmReady(): Promise<void> {
  if (wasmExports || !AI_WASM_BASE64) {
    return
  }

  wasmReadyPromise ??= instantiateWasm()
  await wasmReadyPromise
}

export function getMinesweeperWasmSync(): MinesweeperWasmExports | null {
  if (wasmExports) {
    return wasmExports
  }

  if (!wasmReadyPromise && AI_WASM_BASE64) {
    wasmReadyPromise = instantiateWasm()
  }

  return null
}