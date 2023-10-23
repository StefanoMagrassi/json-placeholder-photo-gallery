/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom';
import {fetch, Request, Response} from 'cross-fetch';

// --- Polyfill `fetch` on Node
(global as any).fetch = fetch;
(global as any).Request = Request;
(global as any).Response = Response;

HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();
