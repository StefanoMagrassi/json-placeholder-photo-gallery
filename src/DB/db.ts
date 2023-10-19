import * as Arr from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';
import {useState} from 'react';
import * as M from './model';

interface DB {
  state: M.Model;
  getPhoto: (id: M.PhotoId) => O.Option<M.Photo>;
  getAlbum: (id: M.AlbumId) => O.Option<M.Album>;
  getUser: (id: M.UserId) => O.Option<M.User>;
  updatePhoto: (photo: M.Photo) => O.Option<M.Photo>;
}

export const useDB = (model: M.Model): DB => {
  const [state, setState] = useState(model);

  return {
    state,
    getPhoto: id => pipe(state.photos, findById(id)),

    getAlbum: id => pipe(state.albums, findById(id)),

    getUser: id => pipe(state.users, findById(id)),

    updatePhoto: photo =>
      pipe(
        state.photos,
        Arr.findIndex(p => p.id === photo.id),
        O.flatMap(i => pipe(state.photos, Arr.updateAt(i, photo))),
        O.tap(photos => O.some(setState(s => ({...s, photos})))),
        O.map(() => photo)
      )
  };
};

const findById = <Id extends number, A extends {id: Id}>(
  id: Id
): ((as: A[]) => O.Option<A>) => Arr.findFirst(a => a.id === id);
