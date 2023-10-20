import * as appy from '@contactlab/appy';
import {
  type Decoder,
  toDecoder,
  withDecoder
} from '@contactlab/appy/combinators/decoder';
import * as E from 'fp-ts/Either';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as TE from 'fp-ts/TaskEither';
import {pipe} from 'fp-ts/function';
import * as D from 'io-ts/Decoder';
import {useEffect, useRef, useState} from 'react';

// --- Request
interface HttpOptions<A> extends RequestInit {
  url: string;
  decoder: D.Decoder<unknown, A>;
}

export interface HttpRequest<A> extends TE.TaskEither<appy.Err, A> {}

export interface Cancellable<A> {
  (signal: AbortSignal): HttpRequest<A>;
}

export const request = <A>({
  url,
  decoder,
  ...options
}: HttpOptions<A>): HttpRequest<A> =>
  pipe(
    appy.request,
    withDecoder(fromIots(decoder)),
    RTE.map(r => r.data)
  )([url, options]);

// --- Remote
type Remote<A> = Idle | Loading | Error | Data<A>;

interface Idle {
  type: 'Idle';
}

interface Loading {
  type: 'Loading';
}

interface Error {
  type: 'Error';
  error: appy.Err;
}

interface Data<A> {
  type: 'Data';
  data: A;
}

export const useRemote = <A>(r: Cancellable<A>): Remote<A> => {
  const [state, setState] = useState<Remote<A>>({type: 'Idle'});

  const controller = useRef<AbortController>();

  useEffect(() => {
    async function run(): Promise<void> {
      controller.current = new AbortController();

      const {signal} = controller.current;

      setState({type: 'Loading'});

      return r(signal)().then(
        E.match(
          error =>
            signal.aborted ? undefined : setState({type: 'Error', error}),
          data => (signal.aborted ? undefined : setState({type: 'Data', data}))
        )
      );
    }

    void run();

    return () => {
      controller.current?.abort();
    };
  }, [r]);

  return state;
};

// --- Helpers
const fromIots = <A>(d: D.Decoder<unknown, A>): Decoder<A> =>
  toDecoder(d.decode, e => new Error(D.draw(e)));
