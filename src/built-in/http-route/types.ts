import { ICancellablePromise, TAbortStrategy } from '@lifaon/observables';
import { IHTTPRoute } from './interfaces';
import { IRouteExecCallbackOptions, IRouteOptions, IRouteResolveCallbackOptions } from '../../core/route/types';
import { IRoute } from '../../core/route/interfaces';
import { IResolvableTreeResolveCallbackNormalizedOptions } from '../../core/resolvable-tree/functions';

/** TYPES */

export type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

/* RESOLVE */

export interface IHTTPRouteResolveCallbackOptions<TStrategy extends TAbortStrategy> extends IRouteResolveCallbackOptions<TStrategy> {
  method: HTTPMethod;
}

export interface IHTTPRouteResolveIncomingCallbackOptions<TStrategy extends TAbortStrategy> extends Pick<IHTTPRouteResolveCallbackOptions<TStrategy>, 'path' | 'method'>,
  IResolvableTreeResolveCallbackNormalizedOptions<TStrategy> {
}

export type IHTTPRouteResolveCallbackNormalizedOptions<TStrategy extends TAbortStrategy> = IHTTPRouteResolveIncomingCallbackOptions<TStrategy>;


export type THTTPRouteResolveCallback = <TStrategy extends TAbortStrategy>(this: IHTTPRoute, options: IHTTPRouteResolveCallbackNormalizedOptions<TStrategy>) => ICancellablePromise<boolean, TStrategy>;


/* EXEC */

export interface IHTTPRouteExecCallbackOptions<TStrategy extends TAbortStrategy> extends IRouteExecCallbackOptions<TStrategy> {
}

export type THTTPRouteExecCallback = <TStrategy extends TAbortStrategy>(this: IRoute, options: IHTTPRouteExecCallbackOptions<TStrategy>) => ICancellablePromise<void, TStrategy>;

/* OPTIONS */

export interface IHTTPRouteOptions extends Omit<IRouteOptions, 'resolve'> {
  children?: Iterable<IHTTPRoute>;
  resolve?: THTTPRouteResolveCallback;
  exec?: THTTPRouteExecCallback;

  methods?: Iterable<HTTPMethod>;
}
