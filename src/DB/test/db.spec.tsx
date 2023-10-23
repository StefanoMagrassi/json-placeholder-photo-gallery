import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {some} from 'fp-ts/Option';
import type {FC} from 'react';
import {type Photo, useDB} from '../db';
import {Model, PhotoId} from '../model';
import {ALBUMS, DB_PHOTOS, PHOTOS, USERS} from './_data';

test('useDB() should return current "state" as an array of Photo', () => {
  render(<Tester />);

  expect(spy).toBeCalledWith(DB_PHOTOS);
});

test('useDB() should return N/D as album title if related photo album is not found', () => {
  render(
    <Tester model={{albums: ALBUMS.slice(1), photos: PHOTOS, users: USERS}} />
  );

  const result: Photo[] = [
    {
      ...DB_PHOTOS[0],
      album: 'N/D',
      user: {name: 'N/D', email: 'N/D'}
    },
    DB_PHOTOS[1]
  ];

  expect(spy).toBeCalledWith(result);
});

test('useDB() should return N/D as user name and email if related photo album user is not found', () => {
  render(
    <Tester model={{albums: ALBUMS, photos: PHOTOS, users: USERS.slice(1)}} />
  );

  const result: Photo[] = [
    {
      ...DB_PHOTOS[0],
      album: 'Album 1',
      user: {name: 'N/D', email: 'N/D'}
    },
    DB_PHOTOS[1]
  ];

  expect(spy).toBeCalledWith(result);
});

test('useDB() should update Photo in current "state" with provided data', async () => {
  render(<Tester />);

  await userEvent.click(screen.getByText('update'));

  const result: Photo[] = [NEW_PHOTO, DB_PHOTOS[1]];

  expect(spy).toBeCalledWith(result);
});

test('useDB() should NOT update Photo in current "state" with provided data if Photo is not found', async () => {
  render(<Tester photo={{...NEW_PHOTO, id: PhotoId(3)}} />);

  expect(spy).toBeCalledWith(DB_PHOTOS);

  await userEvent.click(screen.getByText('update'));

  expect(spy).toBeCalledWith(DB_PHOTOS);
});

// --- Helpers
const NEW_PHOTO: Photo = {
  id: PhotoId(1),
  album: 'new album title',
  rating: some(2.5),
  thumbnailUrl: 'http://new.thumbnail',
  title: 'new photo title',
  url: 'http://new.url',
  user: {
    name: 'User 1',
    email: 'user1@mail.com'
  }
};

const spy = jest.fn();

const Tester: FC<{model?: Model; photo?: Photo}> = ({
  model = {
    albums: ALBUMS,
    photos: PHOTOS,
    users: USERS
  },
  photo = NEW_PHOTO
}) => {
  const {state, updatePhoto} = useDB(model);

  spy(state);

  return <button onClick={() => updatePhoto(photo)}>update</button>;
};
