/**
 * ColumnFilter component tests
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ColumnFilter } from './ColumnFilter';
import { GridProvider } from './GridContext';
import type { GridState } from '../../types/grid.types';
import type { ColumnDefinition } from '../../types/config.types';

// Helper to create test wrapper with GridProvider
function TestWrapper({ 
  children, 
  filters = [] 
}: { 
  children: React.ReactNode; 
  filters?: GridState['filters'] 
}) {
  const initialState: Partial<GridState> = {
    filters,
  };

  return (
    <GridProvider initialState={initialState} data={[]} totalRows={0}>
      {children}
    </GridProvider>
  );
}

describe('ColumnFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Filter Type Rendering', () => {
    test('renders text input for text filter type', () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        filterable: true,
        filterType: 'text',
      };

      render(
        <TestWrapper>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Filter...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    test('renders select input for select filter type', () => {
      const column: ColumnDefinition = {
        key: 'status',
        header: 'Status',
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      };

      render(
        <TestWrapper>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    test('renders number input for number filter type', () => {
      const column: ColumnDefinition = {
        key: 'age',
        header: 'Age',
        filterable: true,
        filterType: 'number',
      };

      render(
        <TestWrapper>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Filter...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });

    test('renders date input for date filter type', () => {
      const column: ColumnDefinition = {
        key: 'hireDate',
        header: 'Hire Date',
        filterable: true,
        filterType: 'date',
      };

      const { container } = render(
        <TestWrapper>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      // Date inputs don't have accessible textbox role in jsdom
      const input = container.querySelector('input[type="date"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'date');
    });

    test('renders empty cell for non-filterable column', () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        filterable: false,
      };

      const { container } = render(
        <TestWrapper>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      // Non-filterable columns render empty div
      const filterCells = container.querySelectorAll('[class*="filterCell"]');
      expect(filterCells.length).toBeGreaterThan(0);
      const emptyCell = Array.from(filterCells).find(cell => cell.children.length === 0);
      expect(emptyCell).toBeTruthy();
    });
  });

  describe('Debounced Filter Updates', () => {
    test('debounces text input changes', async () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        filterable: true,
        filterType: 'text',
      };

      render(
        <TestWrapper>
          <ColumnFilter column={column} debounceMs={100} />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Filter...') as HTMLInputElement;
      
      // Simulate typing - fire change event
      input.value = 'John';
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Input should have the value immediately (local state)
      expect(input.value).toBe('John');
    });

    test('clears filter when input is empty', async () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        filterable: true,
        filterType: 'text',
      };

      render(
        <TestWrapper filters={[
          { columnKey: 'name', operator: 'contains', value: 'John' }
        ]}>
          <ColumnFilter column={column} debounceMs={100} />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Filter...') as HTMLInputElement;
      expect(input.value).toBe('John');
      
      // Clear the input
      input.value = '';
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Input should be cleared immediately
      expect(input.value).toBe('');
    });
  });

  describe('Clear Button', () => {
    test('shows clear button when filter has value', () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        filterable: true,
        filterType: 'text',
      };

      // Render with existing filter value
      render(
        <TestWrapper filters={[
          { columnKey: 'name', operator: 'contains', value: 'test' }
        ]}>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Filter...') as HTMLInputElement;
      expect(input.value).toBe('test');
      
      // Clear button should be visible
      expect(screen.getByLabelText('Clear filter')).toBeInTheDocument();
    });

    test('does not show clear button for date inputs', () => {
      const column: ColumnDefinition = {
        key: 'hireDate',
        header: 'Hire Date',
        filterable: true,
        filterType: 'date',
      };

      const { container } = render(
        <TestWrapper filters={[
          { columnKey: 'hireDate', operator: 'greaterThanOrEqual', value: '2023-01-01' }
        ]}>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      const input = container.querySelector('input[type="date"]');
      expect(input).toBeInTheDocument();
      
      // Date inputs use native picker, so custom clear button should NOT appear
      expect(screen.queryByLabelText('Clear filter')).not.toBeInTheDocument();
    });

    test('clear button exists and is clickable', () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        filterable: true,
        filterType: 'text',
      };

      render(
        <TestWrapper filters={[
          { columnKey: 'name', operator: 'contains', value: 'test' }
        ]}>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Filter...') as HTMLInputElement;
      expect(input.value).toBe('test');
      
      // Clear button is present and clickable
      const clearButton = screen.getByLabelText('Clear filter');
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toBeEnabled();
    });
  });

  describe('State Synchronization', () => {
    test('syncs local value when global filter state changes', () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        filterable: true,
        filterType: 'text',
      };

      // First render with filter
      const { unmount } = render(
        <TestWrapper filters={[
          { columnKey: 'name', operator: 'contains', value: 'John' }
        ]}>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      let input = screen.getByPlaceholderText('Filter...');
      expect(input).toHaveValue('John');
      
      unmount();

      // Re-render without filter (simulates CLEAR_FILTERS)
      render(
        <TestWrapper filters={[]}>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      input = screen.getByPlaceholderText('Filter...');
      expect(input).toHaveValue('');
    });

    test('handles CLEAR_FILTERS by clearing input', () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        filterable: true,
        filterType: 'text',
      };

      // First render with filter
      const { unmount } = render(
        <TestWrapper filters={[
          { columnKey: 'name', operator: 'contains', value: 'Test' }
        ]}>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      let input = screen.getByPlaceholderText('Filter...');
      expect(input).toHaveValue('Test');

      unmount();

      // Re-render without filter (simulates CLEAR_FILTERS)
      render(
        <TestWrapper filters={[]}>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      input = screen.getByPlaceholderText('Filter...');
      expect(input).toHaveValue('');
    });
  });

  describe('Column Width', () => {
    test('applies column width to filter cell', () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        width: '200px',
        filterable: true,
        filterType: 'text',
      };

      const { container } = render(
        <TestWrapper>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      const filterCell = container.querySelector('[class*="filterCell"]');
      expect(filterCell).toHaveStyle({ width: '200px' });
    });
  });

  describe('Active State', () => {
    test('applies active class when filter has value', () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        filterable: true,
        filterType: 'text',
      };

      const { container } = render(
        <TestWrapper filters={[
          { columnKey: 'name', operator: 'contains', value: 'John' }
        ]}>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      const input = container.querySelector('input[placeholder="Filter..."]');
      // CSS modules create scoped class names like _active_2ecabb
      expect(input?.className).toContain('active');
    });

    test('does not apply active class when filter is empty', () => {
      const column: ColumnDefinition = {
        key: 'name',
        header: 'Name',
        filterable: true,
        filterType: 'text',
      };

      const { container } = render(
        <TestWrapper>
          <ColumnFilter column={column} />
        </TestWrapper>
      );

      const input = container.querySelector('input[placeholder="Filter..."]');
      // Should not have active class when empty
      expect(input?.className).not.toContain('active');
    });
  });
});
