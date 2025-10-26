/**
 * Grid Context
 * Provides grid state and dispatch to all grid components
 */

import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import { gridReducer, createInitialGridState } from '../../hooks/useGridReducer';
import type { GridState, GridAction, RowData } from '../../types/grid.types';

/**
 * Grid context value
 */
export interface GridContextValue<T extends RowData = RowData> {
  /** Grid state */
  state: GridState;
  /** Dispatch function for grid actions */
  dispatch: Dispatch<GridAction>;
  /** Current data rows */
  data: T[];
  /** Total number of rows (for pagination) */
  totalRows: number;
}

/**
 * Grid context
 */
const GridContext = createContext<GridContextValue | null>(null);

/**
 * Grid provider props
 */
export interface GridProviderProps<T extends RowData = RowData> {
  /** Child components */
  children: ReactNode;
  /** Initial grid state (optional) */
  initialState?: Partial<GridState>;
  /** Current data */
  data: T[];
  /** Total number of rows */
  totalRows: number;
}

/**
 * Grid provider component
 * Wraps grid components and provides state/dispatch via context
 */
export function GridProvider<T extends RowData = RowData>({
  children,
  initialState,
  data,
  totalRows,
}: GridProviderProps<T>) {
  const [state, dispatch] = useReducer(
    gridReducer,
    initialState ? { ...createInitialGridState(), ...initialState } : createInitialGridState()
  );

  const value: GridContextValue<T> = {
    state,
    dispatch,
    data,
    totalRows,
  };

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
}

/**
 * Hook to access grid context
 * @throws Error if used outside of GridProvider
 */
export function useGridContext<T extends RowData = RowData>(): GridContextValue<T> {
  const context = useContext(GridContext);
  
  if (!context) {
    throw new Error('useGridContext must be used within a GridProvider');
  }
  
  return context as GridContextValue<T>;
}
