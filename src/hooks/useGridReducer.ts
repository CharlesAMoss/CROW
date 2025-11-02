/**
 * Grid state reducer
 * Manages all grid state through actions
 */

import type { GridState, GridAction } from '../types/grid.types';

/**
 * Initial grid state factory
 */
export function createInitialGridState(): GridState {
  return {
    sort: [],
    filters: [],
    expanded: new Set(),
    selected: new Set(),
    editing: null,
    modal: null,
    currentPage: 1,
    pageSize: 50,
    isLoading: false,
    error: null,
  };
}

/**
 * Grid reducer function
 */
export function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case 'SET_SORT':
      return {
        ...state,
        sort: action.payload,
      };

    case 'ADD_SORT':
      return {
        ...state,
        sort: [...state.sort, action.payload],
      };

    case 'REMOVE_SORT':
      return {
        ...state,
        sort: state.sort.filter((s) => s.columnKey !== action.payload),
      };

    case 'SET_FILTER':
      return {
        ...state,
        filters: action.payload,
      };

    case 'ADD_FILTER':
      return {
        ...state,
        filters: [...state.filters, action.payload],
      };

    case 'REMOVE_FILTER':
      return {
        ...state,
        filters: state.filters.filter((f) => f.columnKey !== action.payload),
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: [],
      };

    case 'TOGGLE_EXPAND': {
      const newExpanded = new Set(state.expanded);
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload);
      } else {
        newExpanded.add(action.payload);
      }
      return {
        ...state,
        expanded: newExpanded,
      };
    }

    case 'EXPAND_ALL':
      // Will need row IDs passed in - placeholder for now
      return state;

    case 'COLLAPSE_ALL':
      return {
        ...state,
        expanded: new Set(),
      };

    case 'TOGGLE_SELECT': {
      const newSelected = new Set(state.selected);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return {
        ...state,
        selected: newSelected,
      };
    }

    case 'SELECT_ALL':
      // Will need row IDs passed in - placeholder for now
      return state;

    case 'DESELECT_ALL':
      return {
        ...state,
        selected: new Set(),
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selected: new Set(),
      };

    case 'SELECT_RANGE': {
      // For shift-click range selection
      // Note: This requires row data context to work properly
      // For now, just toggle both endpoints
      const newSelected = new Set(state.selected);
      newSelected.add(action.payload.from);
      newSelected.add(action.payload.to);
      return {
        ...state,
        selected: newSelected,
      };
    }

    case 'START_EDIT':
      return {
        ...state,
        editing: action.payload,
      };

    case 'CANCEL_EDIT':
      return {
        ...state,
        editing: null,
      };

    case 'SAVE_EDIT':
      // Data updates handled by parent component/data provider
      return {
        ...state,
        editing: null,
      };

    case 'OPEN_MODAL':
      return {
        ...state,
        modal: action.payload,
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: null,
      };

    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };

    case 'SET_PAGE_SIZE':
      return {
        ...state,
        pageSize: action.payload,
        currentPage: 1, // Reset to first page
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'RESET_STATE':
      return createInitialGridState();

    default:
      return state;
  }
}
