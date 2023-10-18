import * as appy from '@contactlab/appy';
import {
  type Decoder,
  toDecoder,
  withDecoder
} from '@contactlab/appy/combinators/decoder';
import {pipe} from 'fp-ts/function';
import * as D from 'io-ts/Decoder';
import {createService} from './service';

export const fromIots = <A>(d: D.Decoder<unknown, A>): Decoder<A> =>
  toDecoder(d.decode, e => new Error(D.draw(e)));

interface HttpOptions extends RequestInit {
  url: string;
}

type HttpRequest<A> = ReturnType<appy.Req<A>>;

export interface HttpService {
  request: <A>(
    decoder: D.Decoder<unknown, A>
  ) => (options: HttpOptions) => HttpRequest<A>;
}

export const HttpService = createService<HttpService>('Http');

const HttpLive: HttpService = {
  request:
    decoder =>
    ({url, ...options}) =>
      pipe(appy.request, withDecoder(fromIots(decoder)))([url, options])
};

export const HttpServiceLive = HttpService.provide(() => HttpLive);
