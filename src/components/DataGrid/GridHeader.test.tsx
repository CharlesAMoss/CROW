/**
 * GridHeader structural alignment tests
 * 
 * These tests verify the DOM structure (cell counts, row counts, widths)
 * but CANNOT catch visual alignment issues caused by CSS padding/margin
 * differences between cells. Visual alignment requires manual inspection
 * or visual regression testing tools (Percy, Chromatic, etc.).
 * 
 * Key alignment requirements (must be manually verified):
 * - SelectionColumn padding: 0.75rem 0 (matches headerCell vertical)
 * - emptyFilterCell padding: 0.5rem 1rem (matches filterCell)
 * - All cells: box-sizing: border-box, flex-shrink: 0
 */

import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GridProvider } from './GridContext';
import { GridHeader } from './GridHeader';
import type { ColumnDefinition } from '../../types/config.types';
import type { RowData } from '../../types/grid.types';

describe('GridHeader Alignment', () => {
  const columns: ColumnDefinition<RowData>[] = [
    { key: 'id', header: 'ID', width: '100px', filterable: true, filterType: 'text' },
    { key: 'name', header: 'Name', width: '200px', filterable: true, filterType: 'text' },
    { key: 'email', header: 'Email', width: '250px', filterable: true, filterType: 'text' },
  ];

  test('renders correct number of header cells without selection', () => {
    const { container } = render(
      <GridProvider data={[]} totalRows={0}>
        <GridHeader
          columns={columns}
          filterable={false}
          selectable={false}
        />
      </GridProvider>
    );

    const headerCells = container.querySelectorAll('[role="columnheader"]');
    expect(headerCells.length).toBe(3); // 3 columns, no selection
  });

  test('renders correct number of header cells with selection', () => {
    const { container } = render(
      <GridProvider data={[]} totalRows={0}>
        <GridHeader
          columns={columns}
          filterable={false}
          selectable={true}
          totalRows={10}
        />
      </GridProvider>
    );

    const headerRow = container.querySelector('[role="row"]');
    const allCells = headerRow?.children;
    
    // Selection column + 3 data columns = 4
    expect(allCells?.length).toBe(4);
  });

  test('renders filter row when filterable enabled', () => {
    const { container } = render(
      <GridProvider data={[]} totalRows={0}>
        <GridHeader
          columns={columns}
          filterable={true}
          selectable={false}
        />
      </GridProvider>
    );

    const rows = container.querySelectorAll('[role="row"]');
    expect(rows.length).toBe(2); // Header row + filter row
  });

  test('filter row has matching number of cells with selection', () => {
    const { container } = render(
      <GridProvider data={[]} totalRows={0}>
        <GridHeader
          columns={columns}
          filterable={true}
          selectable={true}
          totalRows={10}
        />
      </GridProvider>
    );

    const rows = container.querySelectorAll('[role="row"]');
    expect(rows.length).toBe(2); // Header row + filter row

    const headerRow = rows[0];
    const filterRow = rows[1];

    // Both rows should have same number of children (selection + columns)
    expect(headerRow.children.length).toBe(filterRow.children.length);
    expect(headerRow.children.length).toBe(4); // 1 selection + 3 columns
  });

  test('columns have width style applied', () => {
    const { container } = render(
      <GridProvider data={[]} totalRows={0}>
        <GridHeader
          columns={columns}
          filterable={false}
          selectable={false}
        />
      </GridProvider>
    );

    const headerCells = container.querySelectorAll('[role="columnheader"]');
    
    // Check that width styles are applied
    expect((headerCells[0] as HTMLElement).style.width).toBe('100px');
    expect((headerCells[1] as HTMLElement).style.width).toBe('200px');
    expect((headerCells[2] as HTMLElement).style.width).toBe('250px');
  });
});
