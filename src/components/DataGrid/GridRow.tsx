/**
 * GridRow component
 * Renders a single data row
 */

import { GridCell } from './GridCell';
import { SelectionColumn } from './SelectionColumn';
import { ExpandToggle } from './ExpandToggle';
import { useGridContext } from './GridContext';
import type { ColumnDefinition } from '../../types/config.types';
import type { RowData } from '../../types/grid.types';
import styles from './GridRow.module.css';

export interface GridRowProps<T extends RowData = RowData> {
  /** Row data */
  row: T;
  /** Row index */
  rowIndex: number;
  /** Column definitions */
  columns: ColumnDefinition<T>[];
  /** Enable row selection */
  selectable?: boolean;
  /** Row key field */
  rowKey?: keyof T;
  /** Nesting level for tree mode (0 for root) */
  level?: number;
  /** Whether this row has children (for tree mode) */
  hasChildren?: boolean;
  /** Whether to show expand toggle (for tree mode) */
  showExpandToggle?: boolean;
  /** Whether this is the last child in its parent's children array */
  isLastChild?: boolean;
}

/**
 * GridRow component
 */
export function GridRow<T extends RowData = RowData>({
  row,
  rowIndex,
  columns,
  selectable = false,
  rowKey = 'id' as keyof T,
  level = 0,
  hasChildren = false,
  showExpandToggle = false,
  isLastChild = false,
}: GridRowProps<T>) {
  const { state, dispatch } = useGridContext<T>();
  const rowId = (row[rowKey] as string | number) ?? rowIndex;
  const isSelected = state.selected.has(rowId);
  const isExpanded = state.expanded.has(rowId);

  const handleToggleExpand = () => {
    dispatch({ type: 'TOGGLE_EXPAND', payload: rowId });
  };

  // Generate tree connector characters (├── for middle, └── for last)
  const getTreeConnector = () => {
    if (level === 0) return '';
    const connector = isLastChild ? '└──' : '├──';
    const indent = '│   '.repeat(level - 1);
    return indent + connector;
  };

  const treeConnector = getTreeConnector();

  return (
    <div
      className={`${styles.gridRow} ${isSelected ? styles.selected : ''}`}
      role="row"
      data-row-index={rowIndex}
      data-selected={isSelected}
      data-level={level}
    >
      {/* Expand/collapse toggle for tree mode */}
      {showExpandToggle && (
        <div className={styles.expandToggleContainer}>
          {treeConnector && (
            <span className={styles.treeConnector}>{treeConnector} </span>
          )}
          <ExpandToggle
            isExpanded={isExpanded}
            onToggle={handleToggleExpand}
            hasChildren={hasChildren}
            level={level}
            ariaLabel={`${isExpanded ? 'Collapse' : 'Expand'} row ${rowIndex + 1}`}
          />
        </div>
      )}

      {/* Selection checkbox */}
      {selectable && (
        <SelectionColumn<T>
          row={row}
          rowIndex={rowIndex}
          rowKey={rowKey}
        />
      )}
      
      {columns.map((column, columnIndex) => (
        <GridCell
          key={String(column.key)}
          row={row}
          column={column}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
        />
      ))}
    </div>
  );
}
