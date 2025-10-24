/**
 * In-memory data provider implementation
 * Provides CRUD operations with client-side query processing
 */

import type { DataProvider, QueryParams, DataResponse } from '../types/data.types';
import { transformData } from '../utils/dataTransforms';

/**
 * Data error interface
 */
export interface DataError extends Error {
  code?: string;
}

export interface InMemoryDataProviderOptions<T> {
  /**
   * Initial data
   */
  data: T[];

  /**
   * Function to extract unique identifier from item
   */
  getItemId: (item: T) => string | number;

  /**
   * Fields to search in for global search
   */
  searchFields?: string[];

  /**
   * Simulated network delay in milliseconds
   */
  delay?: number;

  /**
   * Error simulation config
   */
  errorSimulation?: {
    /**
     * Probability of error (0-1)
     */
    probability: number;

    /**
     * Error message
     */
    message: string;

    /**
     * Error code
     */
    code: string;
  };
}

/**
 * In-memory data provider
 * Uses a flexible constraint to support any object type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class InMemoryDataProvider<T extends Record<string, any>> implements DataProvider<T> {
  private data: T[];
  private getItemId: (item: T) => string | number;
  private searchFields: string[];
  private delay: number;
  private errorSimulation?: {
    probability: number;
    message: string;
    code: string;
  };

  constructor(options: InMemoryDataProviderOptions<T>) {
    this.data = [...options.data];
    this.getItemId = options.getItemId;
    this.searchFields = options.searchFields ?? [];
    this.delay = options.delay ?? 0;
    this.errorSimulation = options.errorSimulation;
  }

  /**
   * Simulate network delay
   */
  private async simulateDelay(): Promise<void> {
    if (this.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delay));
    }
  }

  /**
   * Simulate errors
   */
  private checkError(): void {
    if (this.errorSimulation && Math.random() < this.errorSimulation.probability) {
      const error = new Error(this.errorSimulation.message) as DataError;
      error.code = this.errorSimulation.code;
      throw error;
    }
  }

  /**
   * Fetch data with query parameters
   */
  async fetch(params?: QueryParams): Promise<DataResponse<T>> {
    await this.simulateDelay();
    this.checkError();

    const options = {
      sort: params?.sort,
      filters: params?.filters,
      search: params?.search
        ? {
            term: params.search,
            fields: this.searchFields,
            caseSensitive: false,
          }
        : undefined,
      pagination:
        params?.page && params?.pageSize
          ? {
              page: params.page,
              pageSize: params.pageSize,
            }
          : undefined,
    };

    const result = transformData(this.data, options);

    return {
      data: result.data,
      total: result.total,
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? result.total,
    };
  }

  /**
   * Update item
   */
  async update(id: string | number, updates: Partial<T>): Promise<T> {
    await this.simulateDelay();
    this.checkError();

    const index = this.data.findIndex((item) => this.getItemId(item) === id);

    if (index === -1) {
      const error = new Error(`Item with id ${id} not found`) as DataError;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const updatedItem = { ...this.data[index], ...updates };
    this.data[index] = updatedItem;

    return updatedItem;
  }

  /**
   * Create item
   */
  async create(item: Omit<T, 'id'> | T): Promise<T> {
    await this.simulateDelay();
    this.checkError();

    const newItem = item as T;
    this.data.push(newItem);
    return newItem;
  }

  /**
   * Delete item
   */
  async delete(id: string | number): Promise<void> {
    await this.simulateDelay();
    this.checkError();

    const index = this.data.findIndex((item) => this.getItemId(item) === id);

    if (index === -1) {
      const error = new Error(`Item with id ${id} not found`) as DataError;
      error.code = 'NOT_FOUND';
      throw error;
    }

    this.data.splice(index, 1);
  }

  /**
   * Get all data (for testing/debugging)
   */
  getAllData(): T[] {
    return [...this.data];
  }

  /**
   * Reset data to original state
   */
  resetData(newData: T[]): void {
    this.data = [...newData];
  }

  /**
   * Get data count
   */
  getCount(): number {
    return this.data.length;
  }
}
