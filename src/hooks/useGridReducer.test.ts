/**
 * Tests for grid reducer
 */

import { describe, it, expect } from 'vitest';
import { gridReducer, createInitialGridState } from './useGridReducer';
import type { GridAction } from '../types/grid.types';

describe('createInitialGridState', () => {
  it('should create initial state with default values', () => {
    const state = createInitialGridState();
    expect(state.sort).toEqual([]);
    expect(state.filters).toEqual([]);
    expect(state.expanded).toBeInstanceOf(Set);
    expect(state.expanded.size).toBe(0);
    expect(state.selected).toBeInstanceOf(Set);
    expect(state.selected.size).toBe(0);
    expect(state.editing).toBeNull();
    expect(state.modal).toBeNull();
    expect(state.currentPage).toBe(1);
    expect(state.pageSize).toBe(50);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});

describe('gridReducer', () => {
  describe('sorting actions', () => {
    it('should set sort state', () => {
      const state = createInitialGridState();
      const action: GridAction = {
        type: 'SET_SORT',
        payload: [{ columnKey: 'name', direction: 'asc' }],
      };
      const newState = gridReducer(state, action);
      expect(newState.sort).toHaveLength(1);
      expect(newState.sort[0].columnKey).toBe('name');
    });

    it('should add sort column', () => {
      const state = createInitialGridState();
      const action: GridAction = {
        type: 'ADD_SORT',
        payload: { columnKey: 'age', direction: 'desc' },
      };
      const newState = gridReducer(state, action);
      expect(newState.sort).toHaveLength(1);
      expect(newState.sort[0].columnKey).toBe('age');
    });

    it('should remove sort column', () => {
      const state = {
        ...createInitialGridState(),
        sort: [
          { columnKey: 'name', direction: 'asc' as const },
          { columnKey: 'age', direction: 'desc' as const },
        ],
      };
      const action: GridAction = { type: 'REMOVE_SORT', payload: 'name' };
      const newState = gridReducer(state, action);
      expect(newState.sort).toHaveLength(1);
      expect(newState.sort[0].columnKey).toBe('age');
    });
  });

  describe('filtering actions', () => {
    it('should set filter state', () => {
      const state = createInitialGridState();
      const action: GridAction = {
        type: 'SET_FILTER',
        payload: [{ columnKey: 'status', operator: 'equals', value: 'active' }],
      };
      const newState = gridReducer(state, action);
      expect(newState.filters).toHaveLength(1);
      expect(newState.filters[0].columnKey).toBe('status');
    });

    it('should add filter', () => {
      const state = createInitialGridState();
      const action: GridAction = {
        type: 'ADD_FILTER',
        payload: { columnKey: 'age', operator: 'greaterThan', value: 25 },
      };
      const newState = gridReducer(state, action);
      expect(newState.filters).toHaveLength(1);
      expect(newState.filters[0].operator).toBe('greaterThan');
    });

    it('should remove filter', () => {
      const state = {
        ...createInitialGridState(),
        filters: [
          { columnKey: 'status', operator: 'equals' as const, value: 'active' },
          { columnKey: 'age', operator: 'greaterThan' as const, value: 25 },
        ],
      };
      const action: GridAction = { type: 'REMOVE_FILTER', payload: 'status' };
      const newState = gridReducer(state, action);
      expect(newState.filters).toHaveLength(1);
      expect(newState.filters[0].columnKey).toBe('age');
    });

    it('should clear all filters', () => {
      const state = {
        ...createInitialGridState(),
        filters: [
          { columnKey: 'status', operator: 'equals' as const, value: 'active' },
          { columnKey: 'age', operator: 'greaterThan' as const, value: 25 },
        ],
      };
      const action: GridAction = { type: 'CLEAR_FILTERS' };
      const newState = gridReducer(state, action);
      expect(newState.filters).toHaveLength(0);
    });
  });

  describe('expansion actions', () => {
    it('should toggle expand row', () => {
      const state = createInitialGridState();
      const action: GridAction = { type: 'TOGGLE_EXPAND', payload: 'row-1' };
      const newState = gridReducer(state, action);
      expect(newState.expanded.has('row-1')).toBe(true);
    });

    it('should toggle collapse row', () => {
      const state = createInitialGridState();
      state.expanded.add('row-1');
      const action: GridAction = { type: 'TOGGLE_EXPAND', payload: 'row-1' };
      const newState = gridReducer(state, action);
      expect(newState.expanded.has('row-1')).toBe(false);
    });

    it('should collapse all rows', () => {
      const state = createInitialGridState();
      state.expanded.add('row-1');
      state.expanded.add('row-2');
      const action: GridAction = { type: 'COLLAPSE_ALL' };
      const newState = gridReducer(state, action);
      expect(newState.expanded.size).toBe(0);
    });
  });

  describe('selection actions', () => {
    it('should toggle select row', () => {
      const state = createInitialGridState();
      const action: GridAction = { type: 'TOGGLE_SELECT', payload: 'row-1' };
      const newState = gridReducer(state, action);
      expect(newState.selected.has('row-1')).toBe(true);
    });

    it('should toggle deselect row', () => {
      const state = createInitialGridState();
      state.selected.add('row-1');
      const action: GridAction = { type: 'TOGGLE_SELECT', payload: 'row-1' };
      const newState = gridReducer(state, action);
      expect(newState.selected.has('row-1')).toBe(false);
    });

    it('should deselect all rows', () => {
      const state = createInitialGridState();
      state.selected.add('row-1');
      state.selected.add('row-2');
      const action: GridAction = { type: 'DESELECT_ALL' };
      const newState = gridReducer(state, action);
      expect(newState.selected.size).toBe(0);
    });
  });

  describe('editing actions', () => {
    it('should start editing cell', () => {
      const state = createInitialGridState();
      const action: GridAction = {
        type: 'START_EDIT',
        payload: { rowIndex: 0, columnKey: 'name' },
      };
      const newState = gridReducer(state, action);
      expect(newState.editing).toEqual({ rowIndex: 0, columnKey: 'name' });
    });

    it('should cancel editing', () => {
      const state = {
        ...createInitialGridState(),
        editing: { rowIndex: 0, columnKey: 'name' },
      };
      const action: GridAction = { type: 'CANCEL_EDIT' };
      const newState = gridReducer(state, action);
      expect(newState.editing).toBeNull();
    });

    it('should save edit and clear editing state', () => {
      const state = {
        ...createInitialGridState(),
        editing: { rowIndex: 0, columnKey: 'name' },
      };
      const action: GridAction = {
        type: 'SAVE_EDIT',
        payload: { rowIndex: 0, changes: { name: 'New Name' } },
      };
      const newState = gridReducer(state, action);
      expect(newState.editing).toBeNull();
    });
  });

  describe('modal actions', () => {
    it('should open modal', () => {
      const state = createInitialGridState();
      const action: GridAction = {
        type: 'OPEN_MODAL',
        payload: {
          type: 'detail',
          title: 'Row Details',
          rowData: { id: 1, name: 'Test' },
          rowIndex: 0,
        },
      };
      const newState = gridReducer(state, action);
      expect(newState.modal).toBeDefined();
      expect(newState.modal?.type).toBe('detail');
    });

    it('should close modal', () => {
      const state = {
        ...createInitialGridState(),
        modal: {
          type: 'detail' as const,
          rowData: { id: 1 },
          rowIndex: 0,
        },
      };
      const action: GridAction = { type: 'CLOSE_MODAL' };
      const newState = gridReducer(state, action);
      expect(newState.modal).toBeNull();
    });
  });

  describe('pagination actions', () => {
    it('should set page', () => {
      const state = createInitialGridState();
      const action: GridAction = { type: 'SET_PAGE', payload: 3 };
      const newState = gridReducer(state, action);
      expect(newState.currentPage).toBe(3);
    });

    it('should set page size and reset to page 1', () => {
      const state = { ...createInitialGridState(), currentPage: 5 };
      const action: GridAction = { type: 'SET_PAGE_SIZE', payload: 100 };
      const newState = gridReducer(state, action);
      expect(newState.pageSize).toBe(100);
      expect(newState.currentPage).toBe(1);
    });
  });

  describe('loading and error actions', () => {
    it('should set loading state', () => {
      const state = createInitialGridState();
      const action: GridAction = { type: 'SET_LOADING', payload: true };
      const newState = gridReducer(state, action);
      expect(newState.isLoading).toBe(true);
    });

    it('should set error and clear loading', () => {
      const state = { ...createInitialGridState(), isLoading: true };
      const error = new Error('Test error');
      const action: GridAction = { type: 'SET_ERROR', payload: error };
      const newState = gridReducer(state, action);
      expect(newState.error).toBe(error);
      expect(newState.isLoading).toBe(false);
    });
  });

  describe('reset action', () => {
    it('should reset to initial state', () => {
      const state = {
        ...createInitialGridState(),
        sort: [{ columnKey: 'name', direction: 'asc' as const }],
        filters: [{ columnKey: 'age', operator: 'greaterThan' as const, value: 25 }],
        currentPage: 5,
        isLoading: true,
      };
      const action: GridAction = { type: 'RESET_STATE' };
      const newState = gridReducer(state, action);
      expect(newState).toEqual(createInitialGridState());
    });
  });
});
