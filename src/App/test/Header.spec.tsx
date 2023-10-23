import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Header} from '../Header';

const ON_APPLY = jest.fn();
const ON_RESET = jest.fn();

test('<Header> should render a form to filter by photo or album title or user name and call onApply when is submitted', async () => {
  render(<Header onApply={ON_APPLY} onReset={ON_RESET} />);

  await userEvent.selectOptions(screen.getByRole('combobox'), 'album');

  await userEvent.type(screen.getByRole('textbox'), 'Foo');

  await userEvent.click(screen.getByText('apply'));

  expect(ON_APPLY).toBeCalledWith(['album', 'Foo']);
  expect(ON_RESET).not.toBeCalled();
});

test('<Header> should reset form and call onReset when click on reset button', async () => {
  render(<Header onApply={ON_APPLY} onReset={ON_RESET} />);

  await userEvent.selectOptions(screen.getByRole('combobox'), 'album');

  await userEvent.type(screen.getByRole('textbox'), 'Foo');

  await userEvent.click(screen.getByText('reset'));

  expect(ON_APPLY).not.toBeCalled();
  expect(ON_RESET).toBeCalled();

  expect(screen.getByRole('textbox')).toHaveValue('');
});

test('<Header> should not call onApply if filter or value are not selected', async () => {
  render(<Header onApply={ON_APPLY} onReset={ON_RESET} />);

  await userEvent.click(screen.getByText('apply'));

  expect(ON_APPLY).not.toBeCalled();

  await userEvent.selectOptions(screen.getByRole('combobox'), 'album');

  await userEvent.click(screen.getByText('apply'));

  expect(ON_APPLY).not.toBeCalled();
});
