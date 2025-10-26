/**
 * useDataFetching hook
 * Manages data fetching with query parameters (sort, filter, pagination)
 */

import { useState, useEffect, useCallback } from 'react';
import type { DataProvider, QueryParams } from '../types/data.types';
import type { RowData, SortState, FilterState } from '../types/grid.types';

export interface DataFetchingOptions {
  /** Page number */
  page?: number;
  /** Page size */
  pageSize?: number;
  /** Sort state */
  sort?: SortState[];
  /** Filter state */
  filters?: FilterState[];
  /** Search term */
  search?: string;
}

export interface DataFetchingResult<T extends RowData = RowData> {
  /** Fetched data */
  data: T[];
  /** Total number of rows */
  totalRows: number;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Hook to manage data fetching from a DataProvider
 */
export function useDataFetching<T extends RowData = RowData>(
  dataProvider: DataProvider<T> | undefined,
  options: DataFetchingOptions = {}
): DataFetchingResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!dataProvider) return;

    setLoading(true);
    setError(null);

    try {
      const params: QueryParams = {
        page: options.page ?? 1,
        pageSize: options.pageSize ?? 50,
        sort: options.sort,
        filters: options.filters,
        search: options.search,
      };

      const response = await dataProvider.fetch(params);
      setData(response.data);
      setTotalRows(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      setData([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [
    dataProvider,
    options.page,
    options.pageSize,
    JSON.stringify(options.sort),
    JSON.stringify(options.filters),
    options.search,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    totalRows,
    loading,
    error,
    refetch: fetchData,
  };
}
