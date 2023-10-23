import {render, screen, within} from '@testing-library/react';
import fetchMock from 'fetch-mock';
import {App} from '../index';
import {MODEL} from './_data';

afterEach(() => {
  fetchMock.reset();
});

test('<App> should load data and display the list of photos', async () => {
  fetchMock
    .get('https://jsonplaceholder.typicode.com/users', MODEL.users)
    .get('https://jsonplaceholder.typicode.com/albums', MODEL.albums)
    .get('https://jsonplaceholder.typicode.com/photos', MODEL.photos);

  render(<App />);

  expect(screen.getByText('loading...')).toBeVisible();

  const items = await screen.findAllByRole('listitem');

  expect(items).toHaveLength(2);
  expect(
    items.map(i => within(i).getByRole<HTMLImageElement>('img').src)
  ).toEqual(['http://photo1.thumbnail.com/', 'http://photo2.thumbnail.com/']);
});

test('<App> should render error if loading data fails', async () => {
  fetchMock
    .get('https://jsonplaceholder.typicode.com/users', 400)
    .get('https://jsonplaceholder.typicode.com/albums', MODEL.albums)
    .get('https://jsonplaceholder.typicode.com/photos', MODEL.photos);

  render(<App />);

  expect(screen.getByText('loading...')).toBeVisible();

  await screen.findByText('Error! Request responded with status code 400');
});
