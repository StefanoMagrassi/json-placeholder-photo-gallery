import {none, some} from 'fp-ts/Option';
import {parse, parseF} from '../number';

test('parse() should return Some<integer> when parsing string succeeds, None otherwise', () => {
  expect(parse('1234')).toEqual(some(1234));
  expect(parse('56a7')).toEqual(some(56));
  expect(parse('abcd')).toEqual(none);
});

test('parseF() should return Some<float> when parsing string succeeds, None otherwise', () => {
  expect(parseF('1.234')).toEqual(some(1.234));
  expect(parseF('5.6a7')).toEqual(some(5.6));
  expect(parseF('abcd')).toEqual(none);
});
