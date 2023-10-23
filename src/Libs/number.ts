import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

export const parse = (s: string): O.Option<number> =>
  pipe(parseInt(s, 10), maybeNumber);

export const parseF = (s: string): O.Option<number> =>
  pipe(parseFloat(s), maybeNumber);

const maybeNumber = O.fromPredicate<number>(v => !isNaN(v));
