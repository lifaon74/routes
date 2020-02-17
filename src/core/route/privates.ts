import { IRoute } from './interfaces';
import { IPathMatcher } from '../path-matcher/interfaces';
import { TRouteExecCallback, TRouteResolveCallback } from './types';
import { IResolvableTreePrivatesInternal } from '../resolvable-tree/privates';

/** PRIVATES **/

export const ROUTE_PRIVATE = Symbol('route-private');

export interface IRoutePrivate {
  pathMatcher: IPathMatcher;
  resolve: TRouteResolveCallback;
  exec: TRouteExecCallback | null;
}

export interface IRoutePrivatesInternal extends IResolvableTreePrivatesInternal {
  [ROUTE_PRIVATE]: IRoutePrivate;
}

export interface IRouteInternal extends IRoutePrivatesInternal, IRoute {
}
