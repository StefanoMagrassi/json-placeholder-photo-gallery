import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {type Model, PhotoId} from '../../DB/model';
import {Photos} from '../Photos';
import {MODEL} from './_data';

// build a bigger list of photos
const BIG_MODEL: Model = {
  ...MODEL,
  photos: new Array(10)
    .fill(undefined)
    .map(() => MODEL.photos)
    .reduce((acc, item) => acc.concat(item), [])
    .map((p, i) => ({...p, id: PhotoId(i + 1)}))
};

test('<Photos> should render a paginated list of photos', async () => {
  render(<Photos model={BIG_MODEL} />);

  expect(
    screen.getAllByRole<HTMLLIElement>('listitem').map(li => li.dataset.photoId)
  ).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

  // --- Go to next page
  await userEvent.click(screen.getByText('next'));

  expect(
    screen.getAllByRole<HTMLLIElement>('listitem').map(li => li.dataset.photoId)
  ).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);

  // --- Change page size
  await userEvent.selectOptions(
    screen.getByLabelText('Elements per page:'),
    '25'
  );

  expect(screen.getAllByRole('combobox')[1]).toHaveValue('1'); // go back to first page

  expect(
    screen.getAllByRole<HTMLLIElement>('listitem').map(li => li.dataset.photoId)
  ).toEqual([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20'
  ]);
});

test('<Photos> should filter the list of photos', async () => {
  render(<Photos model={BIG_MODEL} />);

  const filterBy = screen.getByLabelText('Filter by:');
  const value = screen.getByLabelText('Value:');
  const apply = screen.getByText('apply');

  await userEvent.selectOptions(filterBy, 'photo');

  await userEvent.type(value, 'Photo 1');

  await userEvent.click(apply);

  expect(
    screen.getAllByRole<HTMLLIElement>('listitem').map(li => li.dataset.photoId)
  ).toEqual(['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);

  await userEvent.selectOptions(filterBy, 'album');

  await userEvent.clear(value);
  await userEvent.type(value, 'Album 2');

  await userEvent.click(apply);

  expect(
    screen.getAllByRole<HTMLLIElement>('listitem').map(li => li.dataset.photoId)
  ).toEqual(['2', '4', '6', '8', '10', '12', '14', '16', '18', '20']);

  await userEvent.selectOptions(filterBy, 'user');

  await userEvent.clear(value);
  await userEvent.type(value, 'User 1');

  await userEvent.click(apply);

  expect(
    screen.getAllByRole<HTMLLIElement>('listitem').map(li => li.dataset.photoId)
  ).toEqual(['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);

  await userEvent.click(screen.getByText('reset'));

  expect(
    screen.getAllByRole<HTMLLIElement>('listitem').map(li => li.dataset.photoId)
  ).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
});

test('<Photos> should update selected photo when click save in modal', async () => {
  render(<Photos model={BIG_MODEL} />);

  await userEvent.click(screen.getAllByRole('img')[0]);

  const dialog = screen.getByRole<HTMLDialogElement>('dialog');

  expect(dialog).toBeVisible();

  await userEvent.type(screen.getByLabelText('Title:'), ' foo bar');

  await userEvent.click(screen.getByText('Save'));

  expect(dialog).not.toBeVisible();

  expect(screen.getAllByTestId('photo-meta')[0]).toHaveTextContent(
    'Title:Photo 1 foo barAlbum:Album 1User:User 1'
  );
});
