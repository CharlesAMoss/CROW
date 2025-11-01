/**
 * ColumnFilter component
 * Renders filter input based on column configuration
 */

import { useState, useEffect, useCallback } from 'react';
import { useGridContext } from './GridContext';
import type { ColumnDefinition } from '../../types/config.types';
import type { RowData, CellValue } from '../../types/grid.types';
import styles from './ColumnFilter.module.css';

export interface ColumnFilterProps<T extends RowData = RowData> {
  /** Column definition */
  column: ColumnDefinition<T>;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
}

/**
 * ColumnFilter component
 */
export function ColumnFilter<T extends RowData = RowData>({
  column,
  debounceMs = 300,
}: ColumnFilterProps<T>) {
  const { state, dispatch } = useGridContext<T>();
  const columnKey = String(column.key);
  
  // Get current filter value for this column
  const currentFilter = state.filters.find(f => f.columnKey === columnKey);
  const [localValue, setLocalValue] = useState<string>(
    currentFilter?.value !== null && currentFilter?.value !== undefined 
      ? String(currentFilter.value) 
      : ''
  );

  // Sync local value when global filter state changes (e.g., CLEAR_FILTERS)
  useEffect(() => {
    const filterValue = currentFilter?.value !== null && currentFilter?.value !== undefined 
      ? String(currentFilter.value) 
      : '';
    setLocalValue(filterValue);
  }, [currentFilter]);

  // Debounce filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue === '') {
        // Clear filter if empty
        dispatch({
          type: 'REMOVE_FILTER',
          payload: columnKey,
        });
      } else {
        // Update or add filter
        const operator = getOperatorForType(column.filterType || 'text');
        const value = parseValueForType(localValue, column.filterType || 'text');
        
        // Remove existing filter for this column and add new one
        const otherFilters = state.filters.filter(f => f.columnKey !== columnKey);
        
        dispatch({
          type: 'SET_FILTER',
          payload: [
            ...otherFilters,
            {
              columnKey,
              operator,
              value,
            }
          ],
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, columnKey, column.filterType, debounceMs, dispatch, state.filters]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue('');
  }, []);

  // Render appropriate filter input based on column type
  const renderFilterInput = () => {
    const filterType = column.filterType || 'text';
    const hasValue = localValue !== '';

    switch (filterType) {
      case 'select':
        return (
          <select
            className={`${styles.filterSelect} ${hasValue ? styles.active : ''}`}
            value={localValue}
            onChange={handleChange}
          >
            <option value="">All</option>
            {column.filterOptions?.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            className={`${styles.filterInput} ${hasValue ? styles.active : ''}`}
            placeholder="Filter..."
            value={localValue}
            onChange={handleChange}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            className={`${styles.filterInput} ${hasValue ? styles.active : ''}`}
            value={localValue}
            onChange={handleChange}
          />
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            className={`${styles.filterInput} ${hasValue ? styles.active : ''}`}
            placeholder="Filter..."
            value={localValue}
            onChange={handleChange}
          />
        );
    }
  };

  if (!column.filterable) {
    return <div className={styles.filterCell} />;
  }

  const filterType = column.filterType || 'text';
  const showClearButton = localValue && filterType !== 'date'; // Don't show clear on date inputs

  return (
    <div className={styles.filterCell} style={{ width: column.width }}>
      <div className={styles.filterWrapper}>
        {renderFilterInput()}
        {showClearButton && (
          <button
            className={styles.clearButton}
            onClick={handleClear}
            type="button"
            aria-label="Clear filter"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Get default operator for filter type
 */
function getOperatorForType(filterType: string) {
  switch (filterType) {
    case 'select':
      return 'equals';
    case 'number':
    case 'date':
      return 'greaterThanOrEqual';
    case 'text':
    default:
      return 'contains';
  }
}

/**
 * Parse value based on type
 */
function parseValueForType(value: string, filterType: string): CellValue {
  if (!value || value.trim() === '') {
    return value;
  }
  
  switch (filterType) {
    case 'number': {
      const num = Number(value);
      return isNaN(num) ? value : num;
    }
    case 'date': {
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date;
    }
    case 'select':
      // Handle boolean values from select
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    default:
      return value;
  }
}
