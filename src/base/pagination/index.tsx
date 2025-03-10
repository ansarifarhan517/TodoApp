import React, { useMemo, memo } from 'react';
import { Icon, Button, DropDown } from '@base';
import { bemClass } from '@utils';
import './style.scss';

const blk = 'pagination-container';

type PaginationProps = {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of records */
  totalCount: number;
  /** Number of records per page */
  pageSize: number;
  /** Function called when user selects a new page size */
  onPageSizeChange: (newSize: number) => void;
  /** Function called when user navigates to a new page */
  onPageChange: (newPage: number) => void;
  /** Additional CSS class */
  className?: string;
};

const pageSizeOptions = [
  { label: '5 Per Page', value: 5 },
  { label: '10 Per Page', value: 10 },
  { label: '20 Per Page', value: 20 },
  { label: '30 Per Page', value: 30 },
  { label: '40 Per Page', value: 40 },
  { label: '50 Per Page', value: 50 },
];

const getTotalPages = (totalCount: number, pageSize: number) =>
  Math.ceil(totalCount / pageSize);

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageSizeChange,
  onPageChange,
  className,
}) => {
  const totalPages = useMemo(() => getTotalPages(totalCount, pageSize), [totalCount, pageSize]);

  const maxButtons = 10;
  const pageNumbers = useMemo(() => {
    const count = Math.min(totalPages, maxButtons);
    const arr: number[] = [];
    for (let i = 1; i <= count; i++) {
      arr.push(i);
    }
    return arr;
  }, [totalPages]);

  const handlePageSizeChange = (val: Record<string, number | string>) => {
    const newSize = Number(val.pageSize);
    onPageSizeChange(newSize);
    onPageChange(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const containerClass = bemClass([blk, className]);

  return (
    <div className={containerClass}>
      <div className={bemClass([blk, 'records-per-page'])}>
        <span>Records Per Page</span>
        <DropDown
         className={bemClass([blk, 'records-per-page-dropdown'])}
          name="pageSize"
          value={pageSize}
          options={pageSizeOptions}
          changeHandler={handlePageSizeChange}
        />
      </div>

      <div className={bemClass([blk, 'pages'])}>
        <Button
          category='secondary'
          className={bemClass([blk, 'nav-button'])}
          clickHandler={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo;
        </Button>

        {pageNumbers.map((page) => (
          <Button
          category='secondary'
            key={page}
            className={bemClass([blk, 'page-button', { active: currentPage === page }])}
            clickHandler={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}

        {/* Next button */}
          <Button
          category='secondary'
          className={bemClass([blk, 'nav-button'])}
          clickHandler={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </Button>
      </div>
    </div>
  );
};

export default memo(Pagination);
