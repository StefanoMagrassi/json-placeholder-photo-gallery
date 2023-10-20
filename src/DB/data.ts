import * as TE from 'fp-ts/TaskEither';
import {pipe} from 'fp-ts/function';
import {type Cancellable, request} from '../Http';
import {type Model, Albums, Photos, Users} from './model';

const BASE = 'https://jsonplaceholder.typicode.com';

export const getData: Cancellable<Model> = signal =>
  pipe(
    TE.Do,
    TE.apS('users', request({url: `${BASE}/users`, decoder: Users, signal})),
    TE.apS('albums', request({url: `${BASE}/albums`, decoder: Albums, signal})),
    TE.apS('photos', request({url: `${BASE}/photos`, decoder: Photos, signal}))
  );
