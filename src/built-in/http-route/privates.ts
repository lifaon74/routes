import { IHTTPRoute } from './interfaces';
import { IReadonlySet } from '@lifaon/observables';
import { HTTPMethod, THTTPRouteResolveCallback } from './types';
import { IRoutePrivatesInternal } from '../../core/route/privates';

/** PRIVATES **/

export const HTTP_ROUTE_PRIVATE = Symbol('hTTPRoute-private');

export interface IHTTPRoutePrivate {
  resolve: THTTPRouteResolveCallback;
  methods: IReadonlySet<HTTPMethod> | null;
}

export interface IHTTPRoutePrivatesInternal extends IRoutePrivatesInternal {
  [HTTP_ROUTE_PRIVATE]: IHTTPRoutePrivate;
}

export interface IHTTPRouteInternal extends IHTTPRoutePrivatesInternal, IHTTPRoute {
}
