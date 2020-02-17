import { IRoute } from './interfaces';
import { IRouteOptions, IRouteResolveCallbackNormalizedOptions, TRouteResolveCallback } from './types';
import { IRouteInternal, IRoutePrivate, ROUTE_PRIVATE } from './privates';
import { PathMatcher } from '../path-matcher/implementation';
import { IsObject } from '../../misc/helpers/is/IsObject';
import { ConstructClassWithPrivateMembers } from '../../misc/helpers/ClassWithPrivateMembers';
import { CancellablePromise, ICancellablePromise, TAbortStrategy } from '@lifaon/observables';

/** CONSTRUCTOR **/

export const DEFAULT_ROUTE_RESOLVE: TRouteResolveCallback = <TStrategy extends TAbortStrategy>(options: IRouteResolveCallbackNormalizedOptions<TStrategy>): ICancellablePromise<boolean, TStrategy> => {
  return CancellablePromise.resolve<boolean, TStrategy>(true, options);
};

export function ConstructRoute(
  instance: IRoute,
  path: string,
  options: IRouteOptions = {},
): void {
  ConstructClassWithPrivateMembers(instance, ROUTE_PRIVATE);
  const privates: IRoutePrivate = (instance as IRouteInternal)[ROUTE_PRIVATE];

  if (IsObject(options)) {
    if (typeof path === 'string') {
      privates.pathMatcher = new PathMatcher(path);
    } else {
      throw new TypeError(`Expected string as path`);
    }

    if (options.resolve === void 0) {
      privates.resolve = DEFAULT_ROUTE_RESOLVE;
    } else if (typeof options.resolve === 'function') {
      privates.resolve = options.resolve;
    } else {
      throw new TypeError(`Expected void or function as options.resolve`);
    }

    if (options.exec === void 0) {
      privates.exec = null;
    } else if (typeof options.exec === 'function') {
      privates.exec = options.exec;
    } else {
      throw new TypeError(`Expected void or function as options.exec`);
    }

    instance.children.forEach((child: IRoute, index: number) => {
      if (!IsRoute(child)) {
        throw new TypeError(`Expected Route at index #${ index } of options.children`);
      }
    });
  } else {
    throw new TypeError(`Expected void or object as options`);
  }
}

export function IsRoute(value: any): value is IRoute {
  return IsObject(value)
    && value.hasOwnProperty(ROUTE_PRIVATE as symbol);
}
