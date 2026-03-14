// =======================================================================
// Minesweeper runtime helpers for WebAssembly.
//
// Input cells are packed as i32 values:
// - bits 0-1: state (0 hidden, 1 flagged, 2 revealed)
// - bit 2: mine flag
// - bits 3-6: adjacent mine count
//
// Exports:
// - hint selection over encoded cells
// - deterministic mine placement using a seeded xorshift sampler
// =======================================================================

const MAX_CELLS = 480
const STATE_MASK = 0b11
const MINE_BIT = 0b100
const ADJACENT_SHIFT = 3
const ADJACENT_MASK = 0b1111
const HIDDEN_STATE = 0
const DEFAULT_SEED: u32 = 0x9e3779b9

const cells = new StaticArray<i32>(MAX_CELLS)
const minePositions = new StaticArray<i32>(MAX_CELLS)
const candidatePositions = new StaticArray<i32>(MAX_CELLS)
let rngState: u32 = DEFAULT_SEED

function seedRng(seed: u32): void {
	rngState = seed == 0 ? DEFAULT_SEED : seed
}

function nextRandom(limit: i32): i32 {
	if (limit <= 1) {
		return 0
	}

	rngState ^= rngState << 13
	rngState ^= rngState >> 17
	rngState ^= rngState << 5
	return <i32>(rngState % <u32>limit)
}

export function setCell(index: i32, value: i32): void {
	if (index < 0 || index >= MAX_CELLS) {
		return
	}

	unchecked((cells[index] = value))
}

export function getCell(index: i32): i32 {
	if (index < 0 || index >= MAX_CELLS) {
		return 0
	}

	return unchecked(cells[index])
}

export function findSafeCell(length: i32): i32 {
	if (length <= 0) {
		return -1
	}

	let bestIndex = -1
	let bestAdjacent = 99
	const upperBound = length < MAX_CELLS ? length : MAX_CELLS

	for (let index = 0; index < upperBound; index++) {
		const encoded = unchecked(cells[index])
		const state = encoded & STATE_MASK
		const mine = (encoded & MINE_BIT) != 0

		if (state != HIDDEN_STATE || mine) {
			continue
		}

		const adjacent = (encoded >> ADJACENT_SHIFT) & ADJACENT_MASK
		if (adjacent < bestAdjacent) {
			bestIndex = index
			bestAdjacent = adjacent

			if (adjacent == 0) {
				return index
			}
		}
	}

	return bestIndex
}

export function generateMinePositions(length: i32, count: i32, safeIndex: i32, seed: u32): i32 {
	if (length <= 0 || count <= 0) {
		return 0
	}

	seedRng(seed)

	let available = 0
	const upperBound = length < MAX_CELLS ? length : MAX_CELLS
	for (let index = 0; index < upperBound; index++) {
		if (index == safeIndex) {
			continue
		}

		unchecked((candidatePositions[available] = index))
		available += 1
	}

	const target = count < available ? count : available
	for (let index = 0; index < target; index++) {
		const swapIndex = index + nextRandom(available - index)
		const nextPosition = unchecked(candidatePositions[swapIndex])
		unchecked((candidatePositions[swapIndex] = candidatePositions[index]))
		unchecked((candidatePositions[index] = nextPosition))
		unchecked((minePositions[index] = nextPosition))
	}

	return target
}

export function getMinePosition(index: i32): i32 {
	if (index < 0 || index >= MAX_CELLS) {
		return -1
	}

	return unchecked(minePositions[index])
}

export function computeAdjacency(length: i32, cols: i32): void {
	if (length <= 0 || cols <= 0) {
		return
	}

	const rows = (length + cols - 1) / cols
	const upperBound = length < MAX_CELLS ? length : MAX_CELLS

	for (let index = 0; index < upperBound; index++) {
		const encoded = unchecked(cells[index])
		if ((encoded & MINE_BIT) != 0) {
			unchecked((cells[index] = encoded & ((ADJACENT_MASK << ADJACENT_SHIFT) ^ -1)))
			continue
		}

		const row = index / cols
		const col = index % cols
		let adjacent = 0

		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				if (dr == 0 && dc == 0) {
					continue
				}

				const nextRow = row + dr
				const nextCol = col + dc
				if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) {
					continue
				}

				const nextIndex = nextRow * cols + nextCol
				if (nextIndex < 0 || nextIndex >= upperBound) {
					continue
				}

				if ((unchecked(cells[nextIndex]) & MINE_BIT) != 0) {
					adjacent += 1
				}
			}
		}

		const cleared = encoded & ((ADJACENT_MASK << ADJACENT_SHIFT) ^ -1)
		unchecked((cells[index] = cleared | (adjacent << ADJACENT_SHIFT)))
	}
}
