import {paginate} from '../pagination';

const DATA = 'abcdefghijklmnopqrstuwxyz'.split('');

test('paginate() should return a portion of provided array based on selected "page" and size', () => {
  const paginated = paginate(DATA);

  expect(paginated({page: 0, size: 5})).toEqual(['a', 'b', 'c', 'd', 'e']);
  expect(paginated({page: 1, size: 5})).toEqual(['a', 'b', 'c', 'd', 'e']);
  expect(paginated({page: 2, size: 5})).toEqual(['f', 'g', 'h', 'i', 'j']);
});
