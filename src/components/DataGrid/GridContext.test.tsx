/**
 * Tests for GridContext
 */

import { describe, it, expect } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import { GridProvider, useGridContext } from './GridContext';
import type { RowData } from '../../types/grid.types';

describe('GridProvider', () => {
  const testData: RowData[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  it('should render children', () => {
    render(
      <GridProvider data={testData} totalRows={2}>
        <div>Test Content</div>
      </GridProvider>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useGridContext(), {
      wrapper: ({ children }) => (
        <GridProvider data={testData} totalRows={2}>
          {children}
        </GridProvider>
      ),
    });

    expect(result.current.state.sort).toEqual([]);
    expect(result.current.state.filters).toEqual([]);
    expect(result.current.state.currentPage).toBe(1);
    expect(result.current.state.pageSize).toBe(50);
  });

  it('should provide data and totalRows', () => {
    const { result } = renderHook(() => useGridContext(), {
      wrapper: ({ children }) => (
        <GridProvider data={testData} totalRows={100}>
          {children}
        </GridProvider>
      ),
    });

    expect(result.current.data).toEqual(testData);
    expect(result.current.totalRows).toBe(100);
  });

  it('should accept custom initial state', () => {
    const { result } = renderHook(() => useGridContext(), {
      wrapper: ({ children }) => (
        <GridProvider
          data={testData}
          totalRows={2}
          initialState={{ currentPage: 3, pageSize: 100 }}
        >
          {children}
        </GridProvider>
      ),
    });

    expect(result.current.state.currentPage).toBe(3);
    expect(result.current.state.pageSize).toBe(100);
  });

  it('should provide dispatch function', () => {
    const { result } = renderHook(() => useGridContext(), {
      wrapper: ({ children }) => (
        <GridProvider data={testData} totalRows={2}>
          {children}
        </GridProvider>
      ),
    });

    expect(result.current.dispatch).toBeDefined();
    expect(typeof result.current.dispatch).toBe('function');
  });
});

describe('useGridContext', () => {
  it('should throw error when used outside GridProvider', () => {
    expect(() => {
      renderHook(() => useGridContext());
    }).toThrow('useGridContext must be used within a GridProvider');
  });

  it('should not throw error when used inside GridProvider', () => {
    const testData: RowData[] = [{ id: 1, name: 'Test' }];
    
    expect(() => {
      renderHook(() => useGridContext(), {
        wrapper: ({ children }) => (
          <GridProvider data={testData} totalRows={1}>
            {children}
          </GridProvider>
        ),
      });
    }).not.toThrow();
  });
});
