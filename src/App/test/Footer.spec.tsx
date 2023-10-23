import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Footer} from '../Footer';

const ON_PAGE_CHANGE = jest.fn();
const ON_SIZE_CHANGE = jest.fn();

test('<Footer> should render a button to change page to previous one', async () => {
  render(
    <Footer
      page={2}
      size={10}
      total={20}
      onPageChange={ON_PAGE_CHANGE}
      onSizeChange={ON_SIZE_CHANGE}
    />
  );

  const [prev, next] = screen.getAllByRole('button');

  await userEvent.click(prev);

  expect(ON_PAGE_CHANGE).toBeCalledWith(1);
  expect(ON_SIZE_CHANGE).not.toBeCalled();

  expect(next).toBeDisabled();
});

test('<Footer> should render a button to change page to next one', async () => {
  render(
    <Footer
      page={1}
      size={10}
      total={50}
      onPageChange={ON_PAGE_CHANGE}
      onSizeChange={ON_SIZE_CHANGE}
    />
  );

  const [prev, next] = screen.getAllByRole('button');

  await userEvent.click(next);

  expect(ON_PAGE_CHANGE).toBeCalledWith(2);
  expect(ON_SIZE_CHANGE).not.toBeCalled();

  expect(prev).toBeDisabled();
});

test('<Footer> should render a select to change page', async () => {
  render(
    <Footer
      page={2}
      size={10}
      total={50}
      onPageChange={ON_PAGE_CHANGE}
      onSizeChange={ON_SIZE_CHANGE}
    />
  );

  const [select] = screen.getAllByRole('combobox');

  expect(select).toHaveValue('2');

  await userEvent.selectOptions(select, '3');

  expect(ON_PAGE_CHANGE).toBeCalledWith(3);
  expect(ON_SIZE_CHANGE).not.toBeCalled();
});

test('<Footer> should render a select to change size', async () => {
  render(
    <Footer
      page={2}
      size={10}
      total={50}
      onPageChange={ON_PAGE_CHANGE}
      onSizeChange={ON_SIZE_CHANGE}
    />
  );

  const [_, select] = screen.getAllByRole('combobox');

  expect(select).toHaveValue('10');

  await userEvent.selectOptions(select, '25');

  expect(ON_SIZE_CHANGE).toBeCalledWith(25);
  expect(ON_PAGE_CHANGE).not.toBeCalled();
});
