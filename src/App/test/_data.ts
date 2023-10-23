import type {Model} from '../../DB/model';
import {DB_PHOTOS, ALBUMS, PHOTOS as PS, USERS} from '../../DB/test/_data';

export const PHOTOS = DB_PHOTOS;
export const PHOTO = PHOTOS[0];
export const MODEL: Model = {
  albums: ALBUMS,
  photos: PS,
  users: USERS
};
