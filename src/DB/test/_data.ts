import {none} from 'fp-ts/Option';
import type {Photo} from '../db';
import {
  type Albums,
  type Photos,
  type Users,
  AlbumId,
  PhotoId,
  UserId
} from '../model';

export const ALBUMS: Albums = [
  {id: AlbumId(1), title: 'Album 1', userId: UserId(1)},
  {id: AlbumId(2), title: 'Album 2', userId: UserId(2)}
];

export const USERS: Users = [
  {id: UserId(1), name: 'User 1', email: 'user1@mail.com'},
  {id: UserId(2), name: 'User 2', email: 'user2@mail.com'}
];

export const PHOTOS: Photos = [
  {
    id: PhotoId(1),
    albumId: AlbumId(1),
    title: 'Photo 1',
    thumbnailUrl: 'http://photo1.thumbnail.com',
    url: 'http://photo1.image.com'
  },
  {
    id: PhotoId(2),
    albumId: AlbumId(2),
    title: 'Photo 2',
    thumbnailUrl: 'http://photo2.thumbnail.com',
    url: 'http://photo2.image.com'
  }
];

export const DB_PHOTOS: Photo[] = [
  {
    id: PhotoId(1),
    album: 'Album 1',
    rating: none,
    title: 'Photo 1',
    thumbnailUrl: 'http://photo1.thumbnail.com',
    url: 'http://photo1.image.com',
    user: {
      name: 'User 1',
      email: 'user1@mail.com'
    }
  },
  {
    id: PhotoId(2),
    album: 'Album 2',
    rating: none,
    title: 'Photo 2',
    thumbnailUrl: 'http://photo2.thumbnail.com',
    url: 'http://photo2.image.com',
    user: {
      name: 'User 2',
      email: 'user2@mail.com'
    }
  }
];
