import {pipe} from 'fp-ts/function';
import * as D from 'io-ts/Decoder';

export type Brand<T> = T & {readonly __brand: unique symbol};

export interface Model {
  users: Users;
  albums: Albums;
  photos: Photos;
}

type UserId = Brand<number>;
export const UserId = (id: number): UserId => id as UserId;

interface User extends D.TypeOf<typeof User> {}
const User = D.struct({
  id: pipe(D.number, D.map(UserId)),
  name: D.string,
  email: D.string
});

export interface Users extends D.TypeOf<typeof Users> {}
export const Users = D.array(User);

type AlbumId = Brand<number>;
export const AlbumId = (id: number): AlbumId => id as AlbumId;

interface Album extends D.TypeOf<typeof Album> {}
const Album = D.struct({
  id: pipe(D.number, D.map(AlbumId)),
  userId: pipe(D.number, D.map(UserId)),
  title: D.string
});

export interface Albums extends D.TypeOf<typeof Albums> {}
export const Albums = D.array(Album);

type PhotoId = Brand<number>;
export const PhotoId = (id: number): PhotoId => id as PhotoId;

interface Photo extends D.TypeOf<typeof Photo> {}
const Photo = D.struct({
  id: pipe(D.number, D.map(PhotoId)),
  albumId: pipe(D.number, D.map(AlbumId)),
  title: D.string,
  url: D.string,
  thumbnailUrl: D.string
});

export interface Photos extends D.TypeOf<typeof Photos> {}
export const Photos = D.array(Photo);
