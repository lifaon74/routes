import { ICancellablePromise, IReadonlyList, IReadonlySet, TAbortStrategy } from '@lifaon/observables';
import { HTTPMethod, IHTTPRouteOptions, IHTTPRouteResolveCallbackOptions, THTTPRouteExecCallback } from './types';
import { IRoute } from '../../core/route/interfaces';
import { IResolvableTree } from '../../core/resolvable-tree/interfaces';

/** INTERFACES */

export interface IHTTPRouteConstructor {
  new(path: string, options?: IHTTPRouteOptions): IHTTPRoute;
}

export interface IHTTPRoute extends IRoute {
  readonly children: IReadonlyList<IHTTPRoute>;
  readonly exec: THTTPRouteExecCallback | null;
  readonly methods: IReadonlySet<HTTPMethod> | null;

  resolve<TStrategy extends TAbortStrategy>(options: IHTTPRouteResolveCallbackOptions<TStrategy>): ICancellablePromise<IResolvableTree[], TStrategy>;
}



