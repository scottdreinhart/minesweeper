import type { Board } from '@/domain'
import { BoardCell } from '@/ui'

interface GameBoardProps {
  board: Board
  cols: number
  hint: { row: number; col: number } | null
  selected: { row: number; col: number }
  disabled: boolean
  onReveal: (row: number, col: number) => void
  onToggleFlag: (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void
  onChord: (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void
}

export function GameBoard({ board, cols, hint, selected, disabled, onReveal, onToggleFlag, onChord }: GameBoardProps) {
  return (
    <section className="ms-board" style={{ gridTemplateColumns: `repeat(${cols}, minmax(1.8rem, 2.2rem))` }}>
      {board.map((row) =>
        row.map((cell) => (
          <BoardCell
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            highlighted={Boolean(hint && hint.row === cell.row && hint.col === cell.col)}
            selected={selected.row === cell.row && selected.col === cell.col}
            disabled={disabled}
            onReveal={onReveal}
            onToggleFlag={onToggleFlag}
            onChord={onChord}
          />
        )),
      )}
    </section>
  )
}