import { IHTTPRoute } from './interfaces';
import { HTTPMethod, IHTTPRouteOptions } from './types';
import { HTTP_ROUTE_PRIVATE, IHTTPRouteInternal, IHTTPRoutePrivate } from './privates';
import { ReadonlySet } from '@lifaon/observables';
import { IsObject } from '../../misc/helpers/is/IsObject';
import { ConstructClassWithPrivateMembers } from '../../misc/helpers/ClassWithPrivateMembers';
import { IsHTTPMethod } from './functions';
import { DEFAULT_ROUTE_RESOLVE } from '../../core/route/constructor';
import { IRoute } from '../../core/route/interfaces';

/** CONSTRUCTOR **/

export function ConstructHTTPRoute(
  instance: IHTTPRoute,
  path: string,
  options: IHTTPRouteOptions,
): void {
  ConstructClassWithPrivateMembers(instance, HTTP_ROUTE_PRIVATE);
  const privates: IHTTPRoutePrivate = (instance as IHTTPRouteInternal)[HTTP_ROUTE_PRIVATE];

  if (IsObject(options)) {

    if (options.methods === void 0) {
      privates.methods = null;
    } else if (Symbol.iterator in options.methods) {
      const methods: HTTPMethod[] = Array.from(options.methods);
      for (let i = 0, l = methods.length; i < l; i++) {
        if (!IsHTTPMethod(methods[i])) {
          throw new TypeError(`Expected HTTPMethod at index #${ i } of options.methods`);
        }
      }
      privates.methods = new ReadonlySet<HTTPMethod>(methods);
    } else {
      throw new TypeError(`Expected iterable as options.children`);
    }

    if (options.resolve === void 0) {
      privates.resolve = DEFAULT_ROUTE_RESOLVE;
    } else if (typeof options.resolve === 'function') {
      privates.resolve = options.resolve;
    } else {
      throw new TypeError(`Expected void or function as options.resolve`);
    }

    instance.children.forEach((child: IRoute, index: number) => {
      if (!IsHTTPRoute(child)) {
        throw new TypeError(`Expected HTTPRoute at index #${ index } of options.children`);
      }
    });

  } else {
    throw new TypeError(`Expected void or object as options`);
  }
}

export function IsHTTPRoute(value: any): value is IHTTPRoute {
  return IsObject(value)
    && value.hasOwnProperty(HTTP_ROUTE_PRIVATE as symbol);
}
