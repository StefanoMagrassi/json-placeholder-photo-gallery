import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {none, some} from 'fp-ts/Option';
import {Card} from '../Card';
import {CurrentPhotoContext} from '../Context';
import {PHOTO} from './_data';

test('<Card> should display photo data', () => {
  render(<Card photo={PHOTO} />);

  const img = screen.getByRole('img');

  expect(img).toHaveAttribute('alt', 'Photo 1');
  expect(img).toHaveAttribute('src', 'http://photo1.thumbnail.com');

  expect(screen.getByTestId('photo-meta')).toHaveTextContent(
    'Title:Photo 1Album:Album 1User:User 1'
  );
});

test('<Card> should set current photo in context when click on thumbnail', async () => {
  const setCurrentPhoto = jest.fn();

  render(
    <CurrentPhotoContext.Provider value={{currentPhoto: none, setCurrentPhoto}}>
      <Card photo={PHOTO} />
    </CurrentPhotoContext.Provider>
  );

  await userEvent.click(screen.getByRole('img'));

  expect(setCurrentPhoto).toBeCalledWith(some(PHOTO));
});
