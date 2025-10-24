/**
 * Cell renderer type definitions for the CROW data grid
 * @module renderer.types
 */

import type { ComponentType, ReactNode } from 'react';
import type { RowData, CellValue } from './grid.types';
import type { ColumnDefinition } from './config.types';

/**
 * Props passed to cell renderer components
 * @template T - Row data type extending RowData
 */
export interface CellRendererProps<T extends RowData = RowData> {
  /** The cell value */
  value: CellValue;
  
  /** The complete row data */
  row: T;
  
  /** The column definition */
  column: ColumnDefinition<T>;
  
  /** Row index in the dataset */
  rowIndex: number;
  
  /** Column index in the visible columns */
  columnIndex: number;
  
  /** Whether this cell is currently being edited */
  isEditing: boolean;
  
  /** Whether this row is selected */
  isSelected: boolean;
  
  /** Whether this row is expanded (for nested data) */
  isExpanded: boolean;
  
  /** Function to start editing this cell */
  startEdit?: () => void;
  
  /** Function to save edited value */
  saveEdit?: (newValue: CellValue) => void;
  
  /** Function to cancel editing */
  cancelEdit?: () => void;
  
  /** Function to toggle row expansion */
  toggleExpand?: () => void;
  
  /** Function to toggle row selection */
  toggleSelect?: () => void;
}

/**
 * Cell renderer component type
 * React component that receives CellRendererProps
 * @template T - Row data type extending RowData
 */
export type CellRendererComponent<T extends RowData = RowData> = ComponentType<CellRendererProps<T>>;

/**
 * Props for edit cell renderers
 * @template T - Row data type extending RowData
 */
export interface EditCellRendererProps<T extends RowData = RowData> extends CellRendererProps<T> {
  /** Current editing value */
  editValue: CellValue;
  
  /** Function to update editing value */
  onValueChange: (value: CellValue) => void;
  
  /** Function to commit the edit */
  onSave: () => void;
  
  /** Function to cancel the edit */
  onCancel: () => void;
  
  /** Validation error message if any */
  error?: string;
}

/**
 * Edit cell renderer component type
 * @template T - Row data type extending RowData
 */
export type EditCellRendererComponent<T extends RowData = RowData> = ComponentType<EditCellRendererProps<T>>;

/**
 * Props for header cell renderers
 * @template T - Row data type extending RowData
 */
export interface HeaderCellRendererProps<T extends RowData = RowData> {
  /** The column definition */
  column: ColumnDefinition<T>;
  
  /** Column index */
  columnIndex: number;
  
  /** Current sort state for this column */
  sortState?: { direction: 'asc' | 'desc'; priority?: number };
  
  /** Whether this column is filterable */
  isFilterable: boolean;
  
  /** Whether this column is sortable */
  isSortable: boolean;
  
  /** Function to toggle sort */
  onSort?: () => void;
  
  /** Function to open filter panel */
  onFilter?: () => void;
  
  /** Function to resize column */
  onResize?: (newWidth: number) => void;
}

/**
 * Header cell renderer component type
 * @template T - Row data type extending RowData
 */
export type HeaderCellRendererComponent<T extends RowData = RowData> = ComponentType<HeaderCellRendererProps<T>>;

/**
 * Props for empty state renderer
 */
export interface EmptyStateRendererProps {
  /** Empty state message */
  message?: string;
  
  /** Optional icon or illustration */
  icon?: ReactNode;
  
  /** Optional action button */
  action?: ReactNode;
}

/**
 * Empty state renderer component type
 */
export type EmptyStateRendererComponent = ComponentType<EmptyStateRendererProps>;

/**
 * Props for loading state renderer
 */
export interface LoadingStateRendererProps {
  /** Loading message */
  message?: string;
  
  /** Number of skeleton rows to show */
  skeletonRows?: number;
}

/**
 * Loading state renderer component type
 */
export type LoadingStateRendererComponent = ComponentType<LoadingStateRendererProps>;

/**
 * Props for error state renderer
 */
export interface ErrorStateRendererProps {
  /** Error object */
  error: Error;
  
  /** Optional retry function */
  onRetry?: () => void;
}

/**
 * Error state renderer component type
 */
export type ErrorStateRendererComponent = ComponentType<ErrorStateRendererProps>;
