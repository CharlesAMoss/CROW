/**
 * Data transformation utilities
 * Client-side sorting, filtering, searching, and pagination
 */

import type { SortState, FilterState } from '../types/grid.types';

/**
 * Sort data array by sort state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortData<T extends Record<string, any>>(
  data: T[],
  sortState: SortState[]
): T[] {
  if (sortState.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const sort of sortState) {
      const aVal = a[sort.columnKey];
      const bVal = b[sort.columnKey];

      // Handle null/undefined
      if (aVal == null && bVal == null) continue;
      if (aVal == null) return sort.direction === 'asc' ? 1 : -1;
      if (bVal == null) return sort.direction === 'asc' ? -1 : 1;

      // Compare values
      let comparison = 0;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        comparison = aVal === bVal ? 0 : aVal ? 1 : -1;
      } else {
        // Fallback to string comparison
        comparison = String(aVal).localeCompare(String(bVal));
      }

      if (comparison !== 0) {
        return sort.direction === 'asc' ? comparison : -comparison;
      }
    }

    return 0;
  });
}

/**
 * Filter data array by filter state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterData<T extends Record<string, any>>(
  data: T[],
  filters: FilterState[]
): T[] {
  if (filters.length === 0) return data;

  return data.filter((row) => {
    return filters.every((filter) => {
      const value = row[filter.columnKey];
      const filterValue = filter.value;

      switch (filter.operator) {
        case 'equals':
          return value === filterValue;

        case 'notEquals':
          return value !== filterValue;

        case 'contains':
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());

        case 'startsWith':
          return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());

        case 'endsWith':
          return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());

        case 'greaterThan':
          return Number(value) > Number(filterValue);

        case 'lessThan':
          return Number(value) < Number(filterValue);

        case 'greaterThanOrEqual':
          return Number(value) >= Number(filterValue);

        case 'lessThanOrEqual':
          return Number(value) <= Number(filterValue);

        case 'isEmpty':
          return value == null || value === '';

        case 'isNotEmpty':
          return value != null && value !== '';

        default:
          return true;
      }
    });
  });
}

/**
 * Search data array by search term across specified fields
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchData<T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  searchFields: string[],
  caseSensitive: boolean = false
): T[] {
  if (!searchTerm || searchTerm.trim() === '') return data;

  const term = caseSensitive ? searchTerm : searchTerm.toLowerCase();

  return data.filter((row) => {
    return searchFields.some((field) => {
      const value = row[field];
      if (value == null) return false;

      const strValue = caseSensitive ? String(value) : String(value).toLowerCase();
      return strValue.includes(term);
    });
  });
}

/**
 * Paginate data array
 */
export function paginateData<T>(
  data: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
}

/**
 * Calculate total pages
 */
export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

/**
 * Apply all transformations (sort, filter, search, paginate)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformData<T extends Record<string, any>>(
  data: T[],
  options: {
    sort?: SortState[];
    filters?: FilterState[];
    search?: { term: string; fields: string[]; caseSensitive?: boolean };
    pagination?: { page: number; pageSize: number };
  }
): { data: T[]; total: number } {
  let result = data;

  // Apply filtering first
  if (options.filters && options.filters.length > 0) {
    result = filterData(result, options.filters);
  }

  // Apply search
  if (options.search && options.search.term) {
    result = searchData(
      result,
      options.search.term,
      options.search.fields,
      options.search.caseSensitive
    );
  }

  // Get total before pagination
  const total = result.length;

  // Apply sorting
  if (options.sort && options.sort.length > 0) {
    result = sortData(result, options.sort);
  }

  // Apply pagination last
  if (options.pagination) {
    result = paginateData(result, options.pagination.page, options.pagination.pageSize);
  }

  return { data: result, total };
}
