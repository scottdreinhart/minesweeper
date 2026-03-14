import type { Cell, CellState } from '@/domain'

const cellClassByState: Record<CellState, string> = {
  hidden: 'ms-cell ms-cell-hidden',
  flagged: 'ms-cell ms-cell-flagged',
  revealed: 'ms-cell ms-cell-revealed',
}

function cellContent(cell: Pick<Cell, 'mine' | 'adjacentMines' | 'state'>): string {
  if (cell.state === 'flagged') {
    return '🚩'
  }

  if (cell.state === 'hidden') {
    return ''
  }

  if (cell.mine) {
    return '💣'
  }

  return cell.adjacentMines === 0 ? '' : String(cell.adjacentMines)
}

interface BoardCellProps {
  cell: Cell
  highlighted: boolean
  selected: boolean
  disabled: boolean
  onReveal: (row: number, col: number) => void
  onToggleFlag: (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void
  onChord: (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void
}

export function BoardCell({ cell, highlighted, selected, disabled, onReveal, onToggleFlag, onChord }: BoardCellProps) {
  return (
    <button
      type="button"
      className={`${cellClassByState[cell.state]}${highlighted ? ' ms-cell-hint' : ''}${selected ? ' ms-cell-selected' : ''}`}
      data-number={cell.state === 'revealed' && !cell.mine ? cell.adjacentMines : undefined}
      onClick={() => onReveal(cell.row, cell.col)}
      onContextMenu={(event) => onToggleFlag(event, cell.row, cell.col)}
      onDoubleClick={(event) => onChord(event, cell.row, cell.col)}
      disabled={disabled}
      aria-label={`cell-${cell.row}-${cell.col}`}
    >
      {cellContent(cell)}
    </button>
  )
}