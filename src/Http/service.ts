/**
 * @see https://github.com/Matechs-Garage/preview-workshop-july-2021/blob/master/packages/common/src/service/index.ts
 */

import * as NEA from 'fp-ts/NonEmptyArray';
import * as O from 'fp-ts/Option';
import {identity, pipe} from 'fp-ts/function';
import {
  type ComponentType,
  createContext,
  useContext,
  createElement
} from 'react';

class ServiceError extends Error {
  public serviceName: string;

  constructor(name: string) {
    super(`Service "${name}" needs to be provided`);

    this.name = 'ServiceNotProvided';
    this.serviceName = name;
  }
}

/**
 * Type alias for a React component.
 */
type Component<P> = ComponentType<P>;

/**
 * Generalization of a function type: `A` is the list of arguments, `R` is the return type.
 */
type Fn<A extends unknown[], R> = (...args: A) => R;

/**
 * Defines `Provider` as a `Higher Order Component` for better composition.
 */
export type Provider = <P extends object>(_: Component<P>) => Component<P>;

/**
 * A `Service` is an interface that exposes:
 * - a `useService` function that will be used as a hook to consume our service;
 * - a `provide` function that provides the actual service implementation to components that will consume the service.
 */
export interface Service<S> {
  useService: () => S;
  provide: <Args extends unknown[]>(f: Fn<Args, S>) => Fn<Args, Provider>;
}

/**
 * Factory to create a `Service` instance.
 *
 * `name` will be our service's name.
 */
export const createService = <S>(name: string): Service<S> => {
  // Our service is implemented as a React's context to be easly consumed by any component
  // Define the context as Optional to avoid default providing
  const svc = createContext<O.Option<S>>(O.none);

  // Set the name of the service as displayName of the context
  svc.displayName = name;

  /**
   * Defines a hook to access our service.
   *
   * It is defined as separate function in order to not throw an eslint error.
   */
  const useService: Service<S>['useService'] = () =>
    // useContext will return O.Option<S>
    // Fold the option throwing an exception in case of None
    pipe(
      useContext(svc),
      O.match(() => {
        // Creates and error that nicely describes the missing service in the message.
        throw new ServiceError(name);
      }, identity)
    );

  return {
    useService,

    /**
     * Defines the provider helper by wrapping Context.Provider,
     * our `fn` will be called at the beginning of our component
     * so we can use hooks
     */
    provide:
      fn =>
      (...args) =>
      <P extends object>(Component: Component<P>): Component<P> => {
        const provider: Component<P> = p =>
          createElement(
            svc.Provider,
            {value: O.some(fn(...args))},
            createElement(Component, p)
          );

        provider.displayName = `${name}Provider`;

        return provider;
      }
  };
};

/**
 * Combines multiple providers into a single one
 */
export const combine = (...providers: NEA.NonEmptyArray<Provider>): Provider =>
  providers.reduce((f, g) => k => f(g(k)));
