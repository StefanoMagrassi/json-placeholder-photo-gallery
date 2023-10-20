import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

export const parse = (s: string): O.Option<number> =>
  pipe(
    parseInt(s, 10),
    O.fromPredicate(v => !isNaN(v))
  );

export const parseF = (s: string): O.Option<number> =>
  pipe(
    parseFloat(s),
    O.fromPredicate(v => !isNaN(v))
  );
