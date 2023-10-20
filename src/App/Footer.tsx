import type {FC} from 'react';

interface FooterProps {
  page: number;
  size: number;
  total: number;
  onPageChange: (p: number) => void;
  onSizeChange: (p: number) => void;
}

export const Footer: FC<FooterProps> = ({
  page,
  size,
  total,
  onPageChange,
  onSizeChange
}) => {
  const pages = Math.floor(total / size);

  return (
    <footer className="pagination sticky">
      <div>
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          previous
        </button>
        <span>
          {page} / {pages}
        </span>
        <button
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
        >
          next
        </button>
      </div>

      <div>
        <label htmlFor="page-size">Elements per page:</label>
        <select
          id="page-size"
          value={size}
          onChange={e => onSizeChange(parseInt(e.target.value, 10))}
        >
          {[10, 25, 50].map(v => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </footer>
  );
};
