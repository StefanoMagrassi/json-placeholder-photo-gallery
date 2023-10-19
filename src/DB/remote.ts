import type {Err} from '@contactlab/appy';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import {pipe} from 'fp-ts/function';
import {useEffect, useRef, useState} from 'react';
import {HttpService} from '../Http';
import {Albums, Model, Photos, Users} from './model';

const BASE = 'https://jsonplaceholder.typicode.com';

export type State = Idle | Loading | Error | Data;

interface Idle {
  type: 'Idle';
}

interface Loading {
  type: 'Loading';
}

interface Error {
  type: 'Error';
  error: Err;
}

interface Data {
  type: 'Data';
  model: Model;
}

export const useRemote = (): State => {
  const {request} = HttpService.useService();

  const [state, setState] = useState<State>({type: 'Idle'});

  const controller = useRef<AbortController>();

  useEffect(() => {
    async function run(): Promise<void> {
      controller.current = new AbortController();

      const {signal} = controller.current;

      setState({type: 'Loading'});

      const result = await pipe(
        TE.Do,
        TE.apS(
          'users',
          request({url: `${BASE}/users`, decoder: Users, signal})
        ),
        TE.apS(
          'albums',
          request({url: `${BASE}/albums`, decoder: Albums, signal})
        ),
        TE.apS(
          'photos',
          request({url: `${BASE}/photos`, decoder: Photos, signal})
        )
      )();

      return pipe(
        result,
        E.match(
          error =>
            signal.aborted ? undefined : setState({type: 'Error', error}),
          model =>
            signal.aborted ? undefined : setState({type: 'Data', model})
        )
      );
    }

    void run();

    return () => {
      controller.current?.abort();
    };
  }, [request]);

  return state;
};
