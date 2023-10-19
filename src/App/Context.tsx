import * as O from 'fp-ts/Option';
import {constVoid} from 'fp-ts/function';
import {type FC, type PropsWithChildren, createContext, useState} from 'react';
import type {Photo} from '../DB/db';

interface CurrentPhotoContext {
  currentPhoto: O.Option<Photo>;
  setCurrentPhoto: (photo: O.Option<Photo>) => void;
}

export const CurrentPhotoContext = createContext<CurrentPhotoContext>({
  currentPhoto: O.none,
  setCurrentPhoto: constVoid
});

export const CurrentPhotoProvider: FC<PropsWithChildren> = ({children}) => {
  const [currentPhoto, setCurrentPhoto] = useState<O.Option<Photo>>(O.none);

  return (
    <CurrentPhotoContext.Provider value={{currentPhoto, setCurrentPhoto}}>
      {children}
    </CurrentPhotoContext.Provider>
  );
};
