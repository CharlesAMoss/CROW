/**
 * GridControls component
 * Unified control bar for filters, selection, and future features
 */

import { useGridContext } from './GridContext';
import type { RowData } from '../../types/grid.types';
import styles from './GridControls.module.css';

export interface GridControlsProps {
  /** Whether filtering is enabled */
  filterable?: boolean;
}

/**
 * GridControls component
 * Shows active filters, selection count, and clear actions
 */
export function GridControls<T extends RowData = RowData>({
  filterable = false,
}: GridControlsProps) {
  const { state, dispatch } = useGridContext<T>();
  
  const selectedCount = state.selected.size;
  const activeFilterCount = state.filters.length;
  
  // Only show if there are active filters or selections
  if (activeFilterCount === 0 && selectedCount === 0) {
    return null;
  }

  return (
    <div className={styles.gridControls}>
      <div className={styles.statusInfo}>
        {/* Active filter count */}
        {activeFilterCount > 0 && (
          <span className={styles.filterStatus}>
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
          </span>
        )}
        
        {/* Selection count */}
        {selectedCount > 0 && (
          <span className={styles.selectionStatus}>
            {selectedCount} row{selectedCount > 1 ? 's' : ''} selected
          </span>
        )}
      </div>

      <div className={styles.actions}>
        {/* Clear filters button */}
        {filterable && activeFilterCount > 0 && (
          <button
            className={styles.clearButton}
            onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
            title={`Clear ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''}`}
            type="button"
          >
            ✕ Clear Filters
          </button>
        )}
        
        {/* Clear selection button */}
        {selectedCount > 0 && (
          <button
            className={styles.clearButton}
            onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
            title="Clear selection"
            type="button"
          >
            ✕ Clear Selection
          </button>
        )}
      </div>
    </div>
  );
}
