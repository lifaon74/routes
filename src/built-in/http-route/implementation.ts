import { IHTTPRoute } from './interfaces';
import {
  CancellablePromise, ICancellablePromise, IReadonlyList, IReadonlySet, TAbortStrategy
} from '@lifaon/observables';
import {
  HTTPMethod, IHTTPRouteOptions, IHTTPRouteResolveCallbackNormalizedOptions, IHTTPRouteResolveCallbackOptions,
  THTTPRouteResolveCallback
} from './types';
import { HTTP_ROUTE_PRIVATE, IHTTPRouteInternal, IHTTPRoutePrivate } from './privates';
import { ConstructHTTPRoute } from './constructor';
import { Route } from '../../core/route/implementation';
import { IRouteOptions, TRouteResolveCallback } from '../../core/route/types';
import { IResolvableTree } from '../../core/resolvable-tree/interfaces';

/** CONSTRUCTOR FUNCTIONS **/

export function CreateHTTPRouteResolver(): THTTPRouteResolveCallback {
  return function <TStrategy extends TAbortStrategy>(this: IHTTPRoute, options: IHTTPRouteResolveCallbackNormalizedOptions<TStrategy>): ICancellablePromise<boolean, TStrategy> {
    const instance: IHTTPRoute = this;
    const privates: IHTTPRoutePrivate = (instance as IHTTPRouteInternal)[HTTP_ROUTE_PRIVATE];
    const normalizedOptions: IHTTPRouteResolveCallbackNormalizedOptions<TStrategy> = options;

    return CancellablePromise.try<boolean, TStrategy>(() => {
      return (privates.methods === null)
        || privates.methods.has(normalizedOptions.method);
    }, normalizedOptions)
      .then((resolved: boolean) => {
        return resolved
          && (privates.resolve.call(instance, normalizedOptions) as ICancellablePromise<boolean, TStrategy>);
      });
  };

}

const HTTP_ROUTE_RESOLVER = CreateHTTPRouteResolver();

/** METHODS **/

/* GETTERS/SETTERS */

export function HTTPRouteGetMethods(instance: IHTTPRoute): IReadonlySet<HTTPMethod> | null {
  return (instance as IHTTPRouteInternal)[HTTP_ROUTE_PRIVATE].methods;
}

/* METHODS */


/** CLASS **/

export class HTTPRoute extends Route implements IHTTPRoute {
  constructor(path: string, options: IHTTPRouteOptions = {}) {
    const _options: IRouteOptions = {
      ...options,
      resolve: HTTP_ROUTE_RESOLVER as TRouteResolveCallback,
    };
    super(path, _options);
    ConstructHTTPRoute(this, path, options);
  }

  get children(): IReadonlyList<IHTTPRoute> {
    return super['children'] as IReadonlyList<IHTTPRoute>;
  }

  get methods(): IReadonlySet<HTTPMethod> | null {
    return HTTPRouteGetMethods(this);
  }

  resolve<TStrategy extends TAbortStrategy>(options: IHTTPRouteResolveCallbackOptions<TStrategy>): ICancellablePromise<IResolvableTree[], TStrategy> {
    return super.resolve<TStrategy>(options);
  }
}

