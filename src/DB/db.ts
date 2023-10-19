import * as Arr from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';
import {useState} from 'react';
import type {Model, Brand} from './model';

type OriPhoto = Model['photos'][number];

export interface Photo extends Omit<OriPhoto, 'albumId'> {
  album: string;
  user: {
    name: string;
    email: string;
  };
  rating: O.Option<Rating>;
}

interface DB {
  state: Photo[];

  updatePhoto: (photo: Photo) => O.Option<Photo>;
}

export const useDB = (model: Model): DB => {
  const [state, setState] = useState(make(model));

  return {
    state,

    updatePhoto: photo =>
      pipe(
        state,
        Arr.findIndex(p => p.id === photo.id),
        O.flatMap(i => pipe(state, Arr.updateAt(i, photo))),
        O.tap(photos => O.some(setState(s => ({...s, photos})))),
        O.map(() => photo)
      )
  };
};

const RATES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;
type Rating = (typeof RATES)[number];

const make = (model: Model): Photo[] => {
  const findInAlbums = find(model.albums);
  const findInUsers = find(model.users);

  return pipe(
    model.photos,
    Arr.map(({albumId, ...rest}) => {
      const album = findInAlbums(albumId);

      return {
        ...rest,
        album: pipe(
          album,
          O.match(
            () => 'N/D',
            a => a.title
          )
        ),
        user: pipe(
          album,
          O.flatMap(a => findInUsers(a.userId)),
          O.match(
            () => ({name: 'N/D', email: 'N/D'}),
            ({name, email}) => ({name, email})
          )
        ),
        rating: O.none
      };
    })
  );
};

const find = <Id extends Brand<unknown>, A extends {id: Id}>(
  as: A[]
): ((id: Id) => O.Option<A>) => {
  const cache = new Map<Id, A>();

  return id =>
    pipe(
      O.fromNullable(cache.get(id)),
      O.alt(() =>
        pipe(
          as,
          Arr.findFirst(u => u.id === id),
          O.tap(a => O.some(cache.set(id, a)))
        )
      )
    );
};
