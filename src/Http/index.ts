import * as appy from '@contactlab/appy';
import {
  type Decoder,
  toDecoder,
  withDecoder
} from '@contactlab/appy/combinators/decoder';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as TE from 'fp-ts/TaskEither';
import {pipe} from 'fp-ts/function';
import * as D from 'io-ts/Decoder';
import {createService} from './service';

interface HttpOptions<A> extends RequestInit {
  url: string;
  decoder: D.Decoder<unknown, A>;
}

type HttpRequest<A> = TE.TaskEither<appy.Err, A>;

export interface HttpService {
  request: <A>(options: HttpOptions<A>) => HttpRequest<A>;
}

export const HttpService = createService<HttpService>('Http');

const HttpLive: HttpService = {
  request: ({url, decoder, ...options}) =>
    pipe(
      appy.request,
      withDecoder(fromIots(decoder)),
      RTE.map(r => r.data)
    )([url, options])
};

export const HttpServiceLive = HttpService.provide(() => HttpLive);

// --- Helpers
const fromIots = <A>(d: D.Decoder<unknown, A>): Decoder<A> =>
  toDecoder(d.decode, e => new Error(D.draw(e)));
