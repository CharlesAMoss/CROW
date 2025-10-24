/**
 * Tests for data transformation utilities
 */

import { describe, it, expect } from 'vitest';
import { sortData, filterData, searchData, paginateData, getTotalPages, transformData } from './dataTransforms';
import type { SortState, FilterState } from '../types/grid.types';

describe('sortData', () => {
  const data = [
    { id: 1, name: 'Charlie', age: 30, active: true },
    { id: 2, name: 'Alice', age: 25, active: false },
    { id: 3, name: 'Bob', age: 35, active: true },
  ];

  it('should sort by string column ascending', () => {
    const sort: SortState[] = [{ columnKey: 'name', direction: 'asc' }];
    const result = sortData(data, sort);
    expect(result[0].name).toBe('Alice');
    expect(result[1].name).toBe('Bob');
    expect(result[2].name).toBe('Charlie');
  });

  it('should sort by string column descending', () => {
    const sort: SortState[] = [{ columnKey: 'name', direction: 'desc' }];
    const result = sortData(data, sort);
    expect(result[0].name).toBe('Charlie');
    expect(result[1].name).toBe('Bob');
    expect(result[2].name).toBe('Alice');
  });

  it('should sort by number column', () => {
    const sort: SortState[] = [{ columnKey: 'age', direction: 'asc' }];
    const result = sortData(data, sort);
    expect(result[0].age).toBe(25);
    expect(result[1].age).toBe(30);
    expect(result[2].age).toBe(35);
  });

  it('should sort by boolean column', () => {
    const sort: SortState[] = [{ columnKey: 'active', direction: 'asc' }];
    const result = sortData(data, sort);
    expect(result[0].active).toBe(false);
    expect(result[1].active).toBe(true);
  });

  it('should handle multi-column sort', () => {
    const data2 = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Alice', age: 25 },
    ];
    const sort: SortState[] = [
      { columnKey: 'name', direction: 'asc' },
      { columnKey: 'age', direction: 'asc' },
    ];
    const result = sortData(data2, sort);
    expect(result[0]).toEqual({ name: 'Alice', age: 25 });
    expect(result[1]).toEqual({ name: 'Alice', age: 30 });
    expect(result[2]).toEqual({ name: 'Bob', age: 25 });
  });

  it('should return original data when no sort state', () => {
    const result = sortData(data, []);
    expect(result).toEqual(data);
  });
});

describe('filterData', () => {
  const data = [
    { id: 1, name: 'Alice', age: 25, email: 'alice@example.com' },
    { id: 2, name: 'Bob', age: 30, email: 'bob@example.com' },
    { id: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' },
  ];

  it('should filter with equals operator', () => {
    const filters: FilterState[] = [{ columnKey: 'age', operator: 'equals', value: 30 }];
    const result = filterData(data, filters);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Bob');
  });

  it('should filter with notEquals operator', () => {
    const filters: FilterState[] = [{ columnKey: 'age', operator: 'notEquals', value: 30 }];
    const result = filterData(data, filters);
    expect(result).toHaveLength(2);
    expect(result.find((r) => r.name === 'Bob')).toBeUndefined();
  });

  it('should filter with contains operator', () => {
    const filters: FilterState[] = [{ columnKey: 'name', operator: 'contains', value: 'li' }];
    const result = filterData(data, filters);
    expect(result).toHaveLength(2); // Alice and Charlie
  });

  it('should filter with startsWith operator', () => {
    const filters: FilterState[] = [{ columnKey: 'name', operator: 'startsWith', value: 'A' }];
    const result = filterData(data, filters);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });

  it('should filter with endsWith operator', () => {
    const filters: FilterState[] = [{ columnKey: 'email', operator: 'endsWith', value: '.com' }];
    const result = filterData(data, filters);
    expect(result).toHaveLength(3);
  });

  it('should filter with greaterThan operator', () => {
    const filters: FilterState[] = [{ columnKey: 'age', operator: 'greaterThan', value: 30 }];
    const result = filterData(data, filters);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Charlie');
  });

  it('should filter with lessThan operator', () => {
    const filters: FilterState[] = [{ columnKey: 'age', operator: 'lessThan', value: 30 }];
    const result = filterData(data, filters);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });

  it('should filter with multiple filters', () => {
    const filters: FilterState[] = [
      { columnKey: 'age', operator: 'greaterThanOrEqual', value: 30 },
      { columnKey: 'name', operator: 'contains', value: 'o' },
    ];
    const result = filterData(data, filters);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Bob');
  });

  it('should return all data when no filters', () => {
    const result = filterData(data, []);
    expect(result).toEqual(data);
  });
});

describe('searchData', () => {
  const data = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', dept: 'Engineering' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', dept: 'Sales' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', dept: 'Engineering' },
  ];

  it('should search across specified fields', () => {
    const result = searchData(data, 'alice', ['name', 'email'], false);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice Johnson');
  });

  it('should be case-insensitive by default', () => {
    const result = searchData(data, 'ALICE', ['name'], false);
    expect(result).toHaveLength(1);
  });

  it('should support case-sensitive search', () => {
    const result = searchData(data, 'alice', ['name'], true);
    expect(result).toHaveLength(0);
  });

  it('should search across multiple fields', () => {
    const result = searchData(data, 'Engineering', ['name', 'dept'], false);
    expect(result).toHaveLength(2);
  });

  it('should return all data when search term is empty', () => {
    const result = searchData(data, '', ['name'], false);
    expect(result).toEqual(data);
  });
});

describe('paginateData', () => {
  const data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, value: `Item ${i + 1}` }));

  it('should return first page', () => {
    const result = paginateData(data, 1, 10);
    expect(result).toHaveLength(10);
    expect(result[0].id).toBe(1);
    expect(result[9].id).toBe(10);
  });

  it('should return second page', () => {
    const result = paginateData(data, 2, 10);
    expect(result).toHaveLength(10);
    expect(result[0].id).toBe(11);
    expect(result[9].id).toBe(20);
  });

  it('should return partial last page', () => {
    const result = paginateData(data, 3, 10);
    expect(result).toHaveLength(5);
    expect(result[0].id).toBe(21);
    expect(result[4].id).toBe(25);
  });
});

describe('getTotalPages', () => {
  it('should calculate total pages correctly', () => {
    expect(getTotalPages(25, 10)).toBe(3);
    expect(getTotalPages(20, 10)).toBe(2);
    expect(getTotalPages(21, 10)).toBe(3);
    expect(getTotalPages(0, 10)).toBe(0);
  });
});

describe('transformData', () => {
  const data = [
    { id: 1, name: 'Alice', age: 25, dept: 'Engineering' },
    { id: 2, name: 'Bob', age: 30, dept: 'Sales' },
    { id: 3, name: 'Charlie', age: 35, dept: 'Engineering' },
    { id: 4, name: 'Diana', age: 28, dept: 'Marketing' },
    { id: 5, name: 'Eve', age: 32, dept: 'Engineering' },
  ];

  it('should apply all transformations', () => {
    const result = transformData(data, {
      filters: [{ columnKey: 'dept', operator: 'equals', value: 'Engineering' }],
      sort: [{ columnKey: 'age', direction: 'asc' }],
      pagination: { page: 1, pageSize: 2 },
    });

    expect(result.total).toBe(3); // 3 engineers
    expect(result.data).toHaveLength(2); // First 2
    expect(result.data[0].name).toBe('Alice'); // Youngest engineer
    expect(result.data[1].name).toBe('Eve');
  });

  it('should return correct total before pagination', () => {
    const result = transformData(data, {
      filters: [{ columnKey: 'age', operator: 'greaterThan', value: 28 }],
      pagination: { page: 1, pageSize: 2 },
    });

    expect(result.total).toBe(3); // Bob, Charlie, Eve
    expect(result.data).toHaveLength(2);
  });

  it('should handle search with other transforms', () => {
    const result = transformData(data, {
      search: { term: 'e', fields: ['name'], caseSensitive: false },
      sort: [{ columnKey: 'name', direction: 'asc' }],
    });

    expect(result.total).toBe(3); // Alice, Charlie, Eve
    expect(result.data[0].name).toBe('Alice');
    expect(result.data[1].name).toBe('Charlie');
    expect(result.data[2].name).toBe('Eve');
  });
});
