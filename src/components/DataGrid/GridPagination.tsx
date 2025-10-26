import { useGridContext } from './GridContext';
import type { GridConfig } from '../../types/config.types';
import type { RowData } from '../../types/grid.types';
import styles from './GridPagination.module.css';

interface GridPaginationProps<T extends RowData> {
  config: GridConfig<T>;
}

export function GridPagination<T extends RowData>({ config }: GridPaginationProps<T>) {
  const { state, dispatch, totalRows } = useGridContext();

  if (!config.features?.pagination?.enabled) {
    return null;
  }

  const { currentPage, pageSize } = state;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  const handlePrevious = () => {
    if (currentPage > 1) {
      dispatch({ type: 'SET_PAGE', payload: currentPage - 1 });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch({ type: 'SET_PAGE', payload: currentPage + 1 });
    }
  };

  const handleFirst = () => {
    dispatch({ type: 'SET_PAGE', payload: 1 });
  };

  const handleLast = () => {
    dispatch({ type: 'SET_PAGE', payload: totalPages });
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    dispatch({ type: 'SET_PAGE_SIZE', payload: newPageSize });
    dispatch({ type: 'SET_PAGE', payload: 1 }); // Reset to first page
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Showing {startRow} to {endRow} of {totalRows} rows
      </div>

      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={handleFirst}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          ⟪
        </button>
        <button
          className={styles.button}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>
        
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className={styles.button}
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          className={styles.button}
          onClick={handleLast}
          disabled={currentPage >= totalPages}
          aria-label="Last page"
        >
          ⟫
        </button>
      </div>

      <div className={styles.pageSize}>
        <label htmlFor="pageSize">Rows per page:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          className={styles.select}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
}
