import fetchMock from 'fetch-mock';
import {right} from 'fp-ts/Either';
import {getData} from '../data';
import {ALBUMS, PHOTOS, USERS} from './_data';

afterEach(() => {
  fetchMock.restore();
});

test('getData() should request users, albums and phots and put them together in one Model object', async () => {
  fetchMock
    .get('https://jsonplaceholder.typicode.com/users', USERS)
    .get('https://jsonplaceholder.typicode.com/albums', ALBUMS)
    .get('https://jsonplaceholder.typicode.com/photos', PHOTOS);

  const result = await getData(new AbortController().signal)();

  expect(result).toEqual(right({users: USERS, albums: ALBUMS, photos: PHOTOS}));
});
