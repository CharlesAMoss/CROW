/**
 * GridDataFetcher component
 * Bridges GridContext state with data fetching
 */

import { useEffect } from 'react';
import { useGridContext } from './GridContext';
import type { DataProvider } from '../../types/data.types';
import type { RowData } from '../../types/grid.types';

export interface GridDataFetcherProps<T extends RowData = RowData> {
  /** Data provider */
  dataProvider: DataProvider<T>;
  /** Callback when data is fetched */
  onDataFetched: (data: T[], totalRows: number) => void;
  /** Callback when loading state changes */
  onLoadingChange: (loading: boolean) => void;
  /** Callback when error occurs */
  onError: (error: Error | null) => void;
}

/**
 * Component that watches grid state and triggers data fetches
 */
export function GridDataFetcher<T extends RowData = RowData>({
  dataProvider,
  onDataFetched,
  onLoadingChange,
  onError,
}: GridDataFetcherProps<T>) {
  const { state } = useGridContext<T>();

  useEffect(() => {
    const fetchData = async () => {
      onLoadingChange(true);
      onError(null);

      try {
        const response = await dataProvider.fetch({
          page: state.currentPage,
          pageSize: state.pageSize,
          sort: state.sort,
          filters: state.filters,
        });

        onDataFetched(response.data, response.total);
      } catch (err) {
        onError(err instanceof Error ? err : new Error('Failed to fetch data'));
        onDataFetched([], 0);
      } finally {
        onLoadingChange(false);
      }
    };

    fetchData();
  }, [
    dataProvider,
    state.currentPage,
    state.pageSize,
    JSON.stringify(state.sort),
    JSON.stringify(state.filters),
    onDataFetched,
    onLoadingChange,
    onError,
  ]);

  return null;
}
