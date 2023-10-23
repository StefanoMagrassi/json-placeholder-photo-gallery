import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {none, some} from 'fp-ts/Option';
import {CurrentPhotoContext} from '../Context';
import {Modal} from '../Modal';
import {PHOTO} from './_data';

const ON_SAVE = jest.fn();

test('<Modal> should render a dialog with data of current photo in context', () => {
  render(
    <CurrentPhotoContext.Provider
      value={{currentPhoto: some(PHOTO), setCurrentPhoto: jest.fn()}}
    >
      <Modal onSave={ON_SAVE} />
    </CurrentPhotoContext.Provider>
  );

  const dialog = screen.getByRole<HTMLDialogElement>('dialog');

  expect(dialog).toBeVisible();
  expect(dialog.showModal).toBeCalled();
  expect(dialog.close).not.toBeCalled();

  const img = screen.getByRole('img');

  expect(img).toHaveAttribute('src', 'http://photo1.image.com');
  expect(img).toHaveAttribute('alt', 'Photo 1');

  expect(screen.getByLabelText('Title:')).toHaveValue('Photo 1');

  expect(screen.getByLabelText('Rating:')).toHaveValue(undefined);

  expect(screen.getByTestId('modal-meta')).toHaveTextContent(
    'Album:Album 1User name:User 1User email:user1@mail.com'
  );
});

test('<Modal> should close dialog when click on "close" button', async () => {
  let currentPhoto = some(PHOTO);
  const setCurrentPhoto = jest.fn(value => {
    currentPhoto = value;
  });

  const {rerender} = render(
    <CurrentPhotoContext.Provider value={{currentPhoto, setCurrentPhoto}}>
      <Modal onSave={ON_SAVE} />
    </CurrentPhotoContext.Provider>
  );

  const dialog = screen.getByRole<HTMLDialogElement>('dialog');

  await userEvent.click(screen.getByText('Close'));

  expect(setCurrentPhoto).toBeCalledWith(none);

  // simulate rerender after state update
  rerender(
    <CurrentPhotoContext.Provider value={{currentPhoto, setCurrentPhoto}}>
      <Modal onSave={ON_SAVE} />
    </CurrentPhotoContext.Provider>
  );

  expect(dialog.close).toBeCalled();
  expect(dialog).not.toBeVisible();
});

test('<Modal> should save data and close dialog when click on "save" button', async () => {
  let currentPhoto = some(PHOTO);
  const setCurrentPhoto = jest.fn(value => {
    currentPhoto = value;
  });

  const {rerender} = render(
    <CurrentPhotoContext.Provider value={{currentPhoto, setCurrentPhoto}}>
      <Modal onSave={ON_SAVE} />
    </CurrentPhotoContext.Provider>
  );

  const dialog = screen.getByRole<HTMLDialogElement>('dialog');

  await userEvent.type(screen.getByLabelText('Title:'), ' foo bar');

  fireEvent.input(screen.getByLabelText('Rating:'), {target: {value: '2.5'}});

  await userEvent.click(screen.getByText('Save'));

  expect(ON_SAVE).toBeCalledWith({
    ...PHOTO,
    title: 'Photo 1 foo bar',
    rating: some(2.5)
  });

  expect(setCurrentPhoto).toBeCalledWith(none);

  // simulate rerender after state update
  rerender(
    <CurrentPhotoContext.Provider value={{currentPhoto, setCurrentPhoto}}>
      <Modal onSave={ON_SAVE} />
    </CurrentPhotoContext.Provider>
  );

  expect(dialog.close).toBeCalled();
  expect(dialog).not.toBeVisible();
});

test('<Modal> should save title as empty string when input is cleared', async () => {
  render(
    <CurrentPhotoContext.Provider
      value={{currentPhoto: some(PHOTO), setCurrentPhoto: jest.fn()}}
    >
      <Modal onSave={ON_SAVE} />
    </CurrentPhotoContext.Provider>
  );

  await userEvent.clear(screen.getByLabelText('Title:'));

  await userEvent.click(screen.getByText('Save'));

  expect(ON_SAVE).toBeCalledWith({...PHOTO, title: ''});
});
