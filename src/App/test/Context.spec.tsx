import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {none, some} from 'fp-ts/Option';
import {FC, useContext} from 'react';
import {CurrentPhotoContext, CurrentPhotoProvider} from '../Context';
import {PHOTO} from './_data';

test('<CurrentPhotoProvider> should provide CurrentPhotoContext to children using React state', async () => {
  render(
    <CurrentPhotoProvider>
      <Tester />
    </CurrentPhotoProvider>
  );

  expect(spy).toBeCalledWith(none);

  await userEvent.click(screen.getByText('set'));

  expect(spy).toBeCalledWith(some(PHOTO));
});

// --- Helpers
const spy = jest.fn();

const Tester: FC = () => {
  const {currentPhoto, setCurrentPhoto} = useContext(CurrentPhotoContext);

  spy(currentPhoto);

  return <button onClick={() => setCurrentPhoto(some(PHOTO))}>set</button>;
};
