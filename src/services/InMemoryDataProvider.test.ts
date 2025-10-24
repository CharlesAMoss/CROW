/**
 * Tests for InMemoryDataProvider
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDataProvider } from './InMemoryDataProvider';

interface TestItem {
  id: number;
  name: string;
  age: number;
  department: string;
}

describe('InMemoryDataProvider', () => {
  const testData: TestItem[] = [
    { id: 1, name: 'Alice', age: 25, department: 'Engineering' },
    { id: 2, name: 'Bob', age: 30, department: 'Sales' },
    { id: 3, name: 'Charlie', age: 35, department: 'Engineering' },
    { id: 4, name: 'Diana', age: 28, department: 'Marketing' },
    { id: 5, name: 'Eve', age: 32, department: 'Engineering' },
  ];

  let provider: InMemoryDataProvider<TestItem>;

  beforeEach(() => {
    provider = new InMemoryDataProvider({
      data: testData,
      getItemId: (item) => item.id,
      searchFields: ['name', 'department'],
      delay: 0,
    });
  });

  describe('fetch', () => {
    it('should fetch all data without params', async () => {
      const result = await provider.fetch();
      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(5);
    });

    it('should fetch with pagination', async () => {
      const result = await provider.fetch({ page: 1, pageSize: 2 });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(2);
      expect(result.data[0].name).toBe('Alice');
      expect(result.data[1].name).toBe('Bob');
    });

    it('should fetch second page', async () => {
      const result = await provider.fetch({ page: 2, pageSize: 2 });
      expect(result.data).toHaveLength(2);
      expect(result.data[0].name).toBe('Charlie');
      expect(result.data[1].name).toBe('Diana');
    });

    it('should fetch with sorting', async () => {
      const result = await provider.fetch({
        sort: [{ columnKey: 'age', direction: 'asc' }],
      });
      expect(result.data[0].name).toBe('Alice'); // age 25
      expect(result.data[4].name).toBe('Charlie'); // age 35
    });

    it('should fetch with filters', async () => {
      const result = await provider.fetch({
        filters: [{ columnKey: 'department', operator: 'equals', value: 'Engineering' }],
      });
      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it('should fetch with search', async () => {
      const result = await provider.fetch({ search: 'alice' });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Alice');
    });

    it('should fetch with combined params', async () => {
      const result = await provider.fetch({
        filters: [{ columnKey: 'department', operator: 'equals', value: 'Engineering' }],
        sort: [{ columnKey: 'age', direction: 'desc' }],
        page: 1,
        pageSize: 2,
      });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.data[0].name).toBe('Charlie'); // Oldest engineer
      expect(result.data[1].name).toBe('Eve');
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const updated = await provider.update(1, { name: 'Alice Smith' });
      expect(updated.name).toBe('Alice Smith');
      expect(updated.id).toBe(1);
      expect(updated.age).toBe(25); // Unchanged fields preserved
    });

    it('should update multiple fields', async () => {
      const updated = await provider.update(2, { name: 'Robert', age: 31 });
      expect(updated.name).toBe('Robert');
      expect(updated.age).toBe(31);
    });

    it('should persist updates in subsequent fetches', async () => {
      await provider.update(1, { name: 'Alice Smith' });
      const result = await provider.fetch();
      const alice = result.data.find((item) => item.id === 1);
      expect(alice?.name).toBe('Alice Smith');
    });

    it('should throw error for non-existent item', async () => {
      await expect(provider.update(999, { name: 'Test' })).rejects.toThrow('not found');
    });
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const newItem: TestItem = { id: 6, name: 'Frank', age: 29, department: 'Sales' };
      const created = await provider.create(newItem);
      expect(created).toEqual(newItem);
      expect(provider.getCount()).toBe(6);
    });

    it('should persist created item', async () => {
      const newItem: TestItem = { id: 6, name: 'Frank', age: 29, department: 'Sales' };
      await provider.create(newItem);
      const result = await provider.fetch();
      expect(result.total).toBe(6);
      const frank = result.data.find((item) => item.id === 6);
      expect(frank).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete an item', async () => {
      await provider.delete(1);
      expect(provider.getCount()).toBe(4);
    });

    it('should remove item from subsequent fetches', async () => {
      await provider.delete(1);
      const result = await provider.fetch();
      expect(result.total).toBe(4);
      const alice = result.data.find((item) => item.id === 1);
      expect(alice).toBeUndefined();
    });

    it('should throw error for non-existent item', async () => {
      await expect(provider.delete(999)).rejects.toThrow('not found');
    });
  });

  describe('helper methods', () => {
    it('should get all data', () => {
      const allData = provider.getAllData();
      expect(allData).toHaveLength(5);
      expect(allData).toEqual(testData);
    });

    it('should get count', () => {
      expect(provider.getCount()).toBe(5);
    });

    it('should reset data', async () => {
      await provider.delete(1);
      expect(provider.getCount()).toBe(4);
      provider.resetData(testData);
      expect(provider.getCount()).toBe(5);
    });
  });

  describe('error simulation', () => {
    it('should throw errors when configured', async () => {
      const errorProvider = new InMemoryDataProvider({
        data: testData,
        getItemId: (item) => item.id,
        errorSimulation: {
          probability: 1, // Always throw
          message: 'Simulated error',
          code: 'TEST_ERROR',
        },
      });

      await expect(errorProvider.fetch()).rejects.toThrow('Simulated error');
    });

    it('should not throw errors when probability is 0', async () => {
      const errorProvider = new InMemoryDataProvider({
        data: testData,
        getItemId: (item) => item.id,
        errorSimulation: {
          probability: 0,
          message: 'Should not throw',
          code: 'TEST_ERROR',
        },
      });

      const result = await errorProvider.fetch();
      expect(result.data).toHaveLength(5);
    });
  });

  describe('delay simulation', () => {
    it('should delay operations', async () => {
      const delayProvider = new InMemoryDataProvider({
        data: testData,
        getItemId: (item) => item.id,
        delay: 50,
      });

      const start = Date.now();
      await delayProvider.fetch();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(50);
    });
  });
});
