import {fireEvent, render, screen} from '@testing-library/react';
import {none, some} from 'fp-ts/Option';
import {Rating} from '../Rating';

const ON_CHANGE = jest.fn();

test('<Rating> should display "unselected" rating and change value on input change', () => {
  render(<Rating value={none} onChange={ON_CHANGE} />);

  const rating = screen.getByLabelText('Rating:');

  expect(rating).toHaveValue(undefined);

  fireEvent.input(rating, {target: {value: '2.5'}});

  expect(ON_CHANGE).toBeCalledWith(2.5);
});

test('<Rating> should display selected rating', () => {
  render(<Rating value={some(2.5)} onChange={ON_CHANGE} />);

  const rating = screen.getByLabelText('Rating:');

  expect(rating).toHaveValue('2.5');
  expect(rating).toHaveStyle('--value: 2.5');
});
