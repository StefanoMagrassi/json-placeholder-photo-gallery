import {pipe} from 'fp-ts/function';
import * as D from 'io-ts/Decoder';

export interface Model {
  users: Users;
  albums: Albums;
  photos: Photos;
}

type Brand<T> = T & {readonly __brand: unique symbol};

export type UserId = Brand<number>;
export const UserId = (id: number): UserId => id as UserId;

export interface User extends D.TypeOf<typeof User> {}
const User = D.struct({
  id: pipe(D.number, D.map(UserId)),
  name: D.string,
  email: D.string
});

interface Users extends D.TypeOf<typeof Users> {}
export const Users = D.array(User);

export type AlbumId = Brand<number>;
export const AlbumId = (id: number): AlbumId => id as AlbumId;

export interface Album extends D.TypeOf<typeof Album> {}
const Album = D.struct({
  id: pipe(D.number, D.map(AlbumId)),
  userId: pipe(D.number, D.map(UserId)),
  title: D.string
});

interface Albums extends D.TypeOf<typeof Albums> {}
export const Albums = D.array(Album);

export type PhotoId = Brand<number>;
export const PhotoId = (id: number): PhotoId => id as PhotoId;

const RATES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;
type Rating = (typeof RATES)[number];

export interface Photo extends D.TypeOf<typeof Photo> {}
export const Photo = pipe(
  D.struct({
    id: pipe(D.number, D.map(PhotoId)),
    albumId: pipe(D.number, D.map(AlbumId)),
    title: D.string,
    url: D.string,
    thumbnailUrl: D.string
  }),
  D.intersect(
    D.partial({
      rating: pipe(
        D.number,
        D.refine((n): n is Rating => RATES.indexOf(n as Rating) >= 0, 'Rating')
      )
    })
  )
);

interface Photos extends D.TypeOf<typeof Photos> {}
export const Photos = D.array(Photo);
