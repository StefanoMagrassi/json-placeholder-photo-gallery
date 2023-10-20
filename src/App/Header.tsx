import {type FC, useRef} from 'react';

const FILTER_BY = ['photo', 'album', 'user'] as const;
type FilterBy = (typeof FILTER_BY)[number];

export type Filter = [FilterBy, string];

interface HeaderProps {
  onApply: (filter: Filter) => void;
  onReset: () => void;
}

export const Header: FC<HeaderProps> = ({onApply, onReset}) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={e => e.preventDefault()}>
      <header className="filters sticky">
        <div className="field">
          <label htmlFor="filter-by">Filter by:</label>
          <select ref={selectRef} id="filter-by" defaultValue={FILTER_BY[0]}>
            {FILTER_BY.map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filter-value">Value:</label>
          <input ref={inputRef} id="filter-value" type="text" />
        </div>

        <button
          type="submit"
          onClick={() => {
            const filterBy = selectRef.current?.value;
            const value = inputRef.current?.value;

            return filterBy && isFilterBy(filterBy) && value
              ? onApply([filterBy, value])
              : undefined;
          }}
        >
          apply
        </button>

        <button type="reset" onClick={() => onReset()}>
          reset
        </button>
      </header>
    </form>
  );
};

// --- Helpers
const isFilterBy = (s: string): s is FilterBy =>
  FILTER_BY.indexOf(s as FilterBy) >= 0;
