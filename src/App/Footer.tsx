import * as NEA from 'fp-ts/NonEmptyArray';
import * as O from 'fp-ts/Option';
import {constVoid, pipe} from 'fp-ts/function';
import type {FC} from 'react';
import {parse} from '../Libs/number';

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
          <select
            id="page-number"
            value={page}
            onChange={e =>
              pipe(e.target.value, parse, O.match(constVoid, onPageChange))
            }
          >
            {pipe(
              NEA.range(1, pages),
              NEA.map(v => (
                <option key={`page_${v}`} value={v}>
                  {v}
                </option>
              ))
            )}
          </select>
          / {pages}
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
          onChange={e =>
            pipe(e.target.value, parse, O.match(constVoid, onSizeChange))
          }
        >
          {[10, 25, 50].map(v => (
            <option key={`size_${v}`} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </footer>
  );
};
