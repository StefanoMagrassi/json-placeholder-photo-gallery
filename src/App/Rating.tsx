import * as O from 'fp-ts/Option';
import {constVoid, pipe} from 'fp-ts/function';
import type {FC} from 'react';
import {type Rating as PhotoRating, RATES} from '../DB/db';

declare module 'react' {
  interface CSSProperties {
    '--value'?: PhotoRating;
  }
}

interface RatingProps {
  value: O.Option<PhotoRating>;
  onChange: (rate: PhotoRating) => void;
}

export const Rating: FC<RatingProps> = ({value, onChange}) => (
  <div className="field">
    <label htmlFor="rating">Rating:</label>
    <input
      className="rating"
      id="rating"
      type="range"
      name="rating"
      min="1"
      max="5"
      step="0.5"
      defaultValue={pipe(value, O.toUndefined)}
      style={pipe(
        value,
        O.map(v => ({'--value': v})),
        O.toUndefined
      )}
      onInput={e =>
        pipe(
          e.currentTarget.value,
          toRating,
          O.match(constVoid, v => {
            onChange(v);

            e.currentTarget.style.setProperty('--value', String(v));
          })
        )
      }
    />
  </div>
);

// --- Helpers
const toRating = (value: string): O.Option<PhotoRating> =>
  pipe(
    value,
    parseF,
    O.map(float => Math.trunc(float * 10) / 10),
    O.flatMap(O.fromPredicate(isRating))
  );

const isRating = (n: number): n is PhotoRating =>
  RATES.indexOf(n as PhotoRating) >= 0;

const parseF = (s: string): O.Option<number> =>
  pipe(
    parseFloat(s),
    O.fromPredicate(v => !isNaN(v))
  );
