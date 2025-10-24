/**
 * Type system tests - verify types compile and work correctly
 */

import { describe, it, expect, expectTypeOf } from 'vitest';
import type {
  RowData,
  CellValue,
  GridConfig,
  ColumnDefinition,
  DataProvider,
  SortState,
  FilterState,
} from '../types';

// Sample data type for testing
interface SampleRow extends RowData {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

describe('Type System', () => {
  describe('RowData and CellValue', () => {
    it('should accept valid cell values', () => {
      const stringValue: CellValue = 'test';
      const numberValue: CellValue = 42;
      const booleanValue: CellValue = true;
      const dateValue: CellValue = new Date();
      const nullValue: CellValue = null;
      const undefinedValue: CellValue = undefined;

      expect(stringValue).toBe('test');
      expect(numberValue).toBe(42);
      expect(booleanValue).toBe(true);
      expect(dateValue).toBeInstanceOf(Date);
      expect(nullValue).toBeNull();
      expect(undefinedValue).toBeUndefined();
    });

    it('should extend RowData correctly', () => {
      const row: SampleRow = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        active: true,
      };

      expectTypeOf(row).toMatchTypeOf<RowData>();
      expect(row.id).toBe(1);
    });
  });

  describe('GridConfig', () => {
    it('should create valid grid config', () => {
      const config: GridConfig<SampleRow> = {
        columns: [
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name', sortable: true },
          { key: 'email', header: 'Email', filterable: true },
        ],
        displayMode: 'spreadsheet',
      };

      expect(config.columns).toHaveLength(3);
      expect(config.displayMode).toBe('spreadsheet');
    });

    it('should support all display modes', () => {
      const modes = ['fullbleed', 'spreadsheet', 'workflow', 'nested-list', 'custom'] as const;

      modes.forEach(mode => {
        const config: GridConfig<SampleRow> = {
          columns: [],
          displayMode: mode,
        };

        expect(config.displayMode).toBe(mode);
      });
    });

    it('should support optional features', () => {
      const config: GridConfig<SampleRow> = {
        columns: [],
        displayMode: 'spreadsheet',
        features: {
          sorting: { enabled: true, multi: true },
          filtering: { enabled: true },
          pagination: { enabled: true, pageSize: 25 },
          export: { formats: ['csv', 'xlsx', 'pdf'] },
        },
      };

      expect(config.features?.sorting?.enabled).toBe(true);
      expect(config.features?.export?.formats).toContain('csv');
    });
  });

  describe('ColumnDefinition', () => {
    it('should create valid column definitions', () => {
      const column: ColumnDefinition<SampleRow> = {
        key: 'name',
        header: 'Name',
        width: '200px',
        sortable: true,
        filterable: true,
        editable: false,
      };

      expect(column.key).toBe('name');
      expect(column.header).toBe('Name');
      expect(column.sortable).toBe(true);
    });

    it('should support formatter functions', () => {
      const column: ColumnDefinition<SampleRow> = {
        key: 'age',
        header: 'Age',
        formatter: (value) => `${value} years old`,
      };

      expect(column.formatter).toBeDefined();
      if (column.formatter) {
        const formatted = column.formatter(25, {} as SampleRow, column);
        expect(formatted).toBe('25 years old');
      }
    });

    it('should support cell class name functions', () => {
      const column: ColumnDefinition<SampleRow> = {
        key: 'active',
        header: 'Status',
        cellClassName: (value) => value ? 'active' : 'inactive',
      };

      expect(column.cellClassName).toBeDefined();
      if (typeof column.cellClassName === 'function') {
        expect(column.cellClassName(true, {} as SampleRow)).toBe('active');
        expect(column.cellClassName(false, {} as SampleRow)).toBe('inactive');
      }
    });
  });

  describe('SortState and FilterState', () => {
    it('should create valid sort state', () => {
      const sort: SortState = {
        columnKey: 'name',
        direction: 'asc',
        priority: 1,
      };

      expect(sort.columnKey).toBe('name');
      expect(sort.direction).toBe('asc');
    });

    it('should create valid filter state', () => {
      const filter: FilterState = {
        columnKey: 'age',
        operator: 'greaterThan',
        value: 18,
      };

      expect(filter.columnKey).toBe('age');
      expect(filter.operator).toBe('greaterThan');
      expect(filter.value).toBe(18);
    });
  });

  describe('DataProvider', () => {
    it('should implement data provider interface', async () => {
      const mockProvider: DataProvider<SampleRow> = {
        fetch: async () => ({
          data: [
            { id: 1, name: 'John', email: 'john@test.com', age: 30, active: true },
            { id: 2, name: 'Jane', email: 'jane@test.com', age: 25, active: true },
          ],
          total: 2,
          page: 1,
          pageSize: 10,
        }),
      };

      const result = await mockProvider.fetch();

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.data[0].name).toBe('John');
    });

    it('should support CRUD operations', async () => {
      const mockProvider: DataProvider<SampleRow> = {
        fetch: async () => ({ data: [], total: 0, page: 1, pageSize: 10 }),
        create: async (data) => {
          const newRow = { ...data, id: 3 };
          return newRow as SampleRow;
        },
        update: async (id, changes) => ({ id, ...changes } as SampleRow),
        delete: async () => undefined,
      };

      expect(mockProvider.create).toBeDefined();
      expect(mockProvider.update).toBeDefined();
      expect(mockProvider.delete).toBeDefined();

      if (mockProvider.create) {
        const newRow = await mockProvider.create({ 
          name: 'Test', 
          email: 'test@test.com', 
          age: 20, 
          active: true 
        });
        expect(newRow.id).toBe(3);
      }
    });
  });

  describe('Type Safety', () => {
    it('should enforce column key matches row data', () => {
      // This should compile - key exists in SampleRow
      const validColumn: ColumnDefinition<SampleRow> = {
        key: 'name',
        header: 'Name',
      };

      expect(validColumn.key).toBe('name');

      // This would cause a TypeScript error at compile time:
      // const invalidColumn: ColumnDefinition<SampleRow> = {
      //   key: 'nonexistent', // Error: Type '"nonexistent"' is not assignable to type keyof SampleRow
      //   header: 'Invalid',
      // };
    });

    it('should provide type inference for row data', () => {
      const config: GridConfig<SampleRow> = {
        columns: [
          {
            key: 'name',
            header: 'Name',
            formatter: (value, row) => {
              // TypeScript should infer row type as SampleRow
              expectTypeOf(row).toMatchTypeOf<SampleRow>();
              expectTypeOf(row.email).toBeString();
              return String(value);
            },
          },
        ],
        displayMode: 'spreadsheet',
      };

      expect(config.columns[0].key).toBe('name');
    });
  });

  describe('Generic Type Constraints', () => {
    it('should work with custom row types', () => {
      interface CustomRow extends RowData {
        productId: string;
        productName: string;
        price: number;
        inStock: boolean;
      }

      const config: GridConfig<CustomRow> = {
        columns: [
          { key: 'productId', header: 'ID' },
          { key: 'productName', header: 'Product' },
          { key: 'price', header: 'Price', formatter: (v) => `$${v}` },
        ],
        displayMode: 'spreadsheet',
      };

      expect(config.columns).toHaveLength(3);
      expectTypeOf(config.columns[0].key).toEqualTypeOf<keyof CustomRow>();
    });
  });
});
