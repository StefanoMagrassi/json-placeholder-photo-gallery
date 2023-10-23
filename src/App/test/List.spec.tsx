import {render, screen, within} from '@testing-library/react';
import {List} from '../List';
import {PHOTOS} from './_data';

test('<List> should render a paginated list of provided photos', () => {
  render(<List photos={PHOTOS} pagination={{page: 1, size: 10}} />);

  const photos = screen.getAllByRole('listitem');

  expect(photos).toHaveLength(2);

  expect(within(photos[0]).getByRole('img')).toHaveAttribute('alt', 'Photo 1');
  expect(within(photos[1]).getByRole('img')).toHaveAttribute('alt', 'Photo 2');
});

test('<List> should render empty message when provided photos is empty', () => {
  render(<List photos={[]} pagination={{page: 1, size: 10}} />);

  expect(screen.getByText('No results')).toBeVisible();
});
