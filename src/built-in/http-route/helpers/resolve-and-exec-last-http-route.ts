import { ICancellablePromise, TAbortStrategy } from '@lifaon/observables';
import { HTTPMethod } from '../types';
import { IHTTPRoute } from '../interfaces';
import {
  IResolveAndExecLastRouteCallbackOptions, IResolveAndExecLastRouteOptions, ResolveAndExecLastRoute
} from '../../../core/route/helpers/resolve-and-exec-last-route';

export interface IResolveAndExecLastHTTPRouteOptions<TStrategy extends TAbortStrategy> extends IResolveAndExecLastRouteOptions<TStrategy> {
  method: HTTPMethod;
}


export interface IResolveAndExecLastHTTPRouteCallbackOptions<TStrategy extends TAbortStrategy> extends Pick<IResolveAndExecLastHTTPRouteOptions<TStrategy>, 'method'>,
  IResolveAndExecLastRouteCallbackOptions<TStrategy> {
}

export function ResolveAndExecLastHTTPRoute<TStrategy extends TAbortStrategy>(
  route: IHTTPRoute,
  options: IResolveAndExecLastHTTPRouteOptions<TStrategy>
): ICancellablePromise<void, TStrategy> {
  return ResolveAndExecLastRoute<TStrategy>(route, options);
}

