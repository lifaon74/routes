import { IPathMatcher } from '../path-matcher/interfaces';
import { ICancellablePromise, IReadonlyList, TAbortStrategy } from '@lifaon/observables';
import { IRouteOptions, IRouteResolveCallbackOptions, TRouteExecCallback } from './types';
import { IResolvableTree } from '../resolvable-tree/interfaces';

/** INTERFACES */

export interface IRouteConstructor {
  new(path: string, options?: IRouteOptions): IRoute;
}

export interface IRoute extends IResolvableTree {
  readonly children: IReadonlyList<IRoute>;
  readonly pathMatcher: IPathMatcher;
  readonly exec: TRouteExecCallback | null;


  // resolve<TStrategy extends TAbortStrategy>(options: IRouteResolveCallbackOptions<TStrategy>): ICancellablePromise<IRoute[], TStrategy>;
  resolve<TStrategy extends TAbortStrategy>(options: IRouteResolveCallbackOptions<TStrategy>): ICancellablePromise<IResolvableTree[], TStrategy>;
}


