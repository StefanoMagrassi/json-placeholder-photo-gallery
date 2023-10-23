import {render, waitFor} from '@testing-library/react';
import fetchMock from 'fetch-mock';
import {right} from 'fp-ts/Either';
import * as D from 'io-ts/Decoder';
import type {FC} from 'react';
import {Cancellable, request, useRemote} from '../index';

const url = 'http://test.com/test';
const decoder = D.struct({
  data: D.string
});

type Data = D.TypeOf<typeof decoder>;

const DATA: Data = {data: 'Hello world!'};

afterEach(() => {
  fetchMock.reset();
});

test('request() should return an HttpRequest with provided url, options and decoder', async () => {
  fetchMock.mock('http://test.com/test', DATA);

  const req = request({url, decoder, method: 'GET'});
  const resp = await req();

  expect(resp).toEqual(right(DATA));

  expect(fetchMock.lastOptions()?.method).toBe('GET');
});

test('useRemote() should run request and change Remote state to `Data` when succeeds', async () => {
  fetchMock.mock('http://test.com/test', DATA);

  render(<Tester />);

  expect(spy).toBeCalledWith({type: 'Idle'});

  await waitFor(() => expect(spy).toBeCalledWith({type: 'Data', data: DATA}));
});

test('useRemote() should run request and change Remote state to `Error` when fails', async () => {
  fetchMock.mock('http://test.com/test', 400);

  render(<Tester />);

  expect(spy).toBeCalledWith({type: 'Idle'});

  await waitFor(() => expect(spy.mock.calls[2][0].type).toBe('Error'));
});

test('useRemote() should run request and change Remote state to `Error` when decoding fails', async () => {
  fetchMock.mock('http://test.com/test', DATA);

  render(<Tester r={signal => request({url, decoder: D.string, signal})} />);

  expect(spy).toBeCalledWith({type: 'Idle'});

  await waitFor(() => expect(spy.mock.calls[2][0].type).toBe('Error'));
});

test('useRemote() should cancel request when component unmounts', async () => {
  fetchMock.mock('http://test.com/test', DATA);

  const {unmount} = render(<Tester />);

  unmount();

  expect(spy).toBeCalledWith({type: 'Idle'});

  await waitFor(() => expect(spy).toBeCalledWith({type: 'Loading'}));

  expect(spy).toBeCalledTimes(2);
});

// --- Helpers
const spy = jest.fn();

const cancellable: Cancellable<Data> = signal =>
  request({url, decoder, signal});

const Tester: FC<{r?: Cancellable<unknown>}> = ({r = cancellable}) => {
  const state = useRemote(r);

  spy(state);

  return <>{state.type}</>;
};
