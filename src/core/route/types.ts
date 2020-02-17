import { ICancellablePromise, ICancellablePromiseOptions, TAbortStrategy } from '@lifaon/observables';
import { IRoute } from './interfaces';
import { IResolvableTreeOptions, IResolvableTreeResolveCallbackOptions, } from '../resolvable-tree/types';
import {
  ICreateResolvableTreeResolverOptionsResolveCallbackReturnedValue, IResolvableTreeResolveCallbackNormalizedOptions
} from '../resolvable-tree/functions';

/** TYPES */


/* RESOLVE */

export interface IRouteResolveCallbackOptions<TStrategy extends TAbortStrategy> extends IResolvableTreeResolveCallbackOptions<TStrategy> {
  path: string;
}

export interface IRouteResolveIncomingCallbackOptions<TStrategy extends TAbortStrategy> extends Pick<IRouteResolveCallbackOptions<TStrategy>, 'path'>,
  IResolvableTreeResolveCallbackNormalizedOptions<TStrategy> {
}

export type IRouteResolveCallbackNormalizedOptions<TStrategy extends TAbortStrategy> = IRouteResolveIncomingCallbackOptions<TStrategy>;

export interface ICreateRouteResolverOptionsResolveCallbackReturnedValue<TStrategy extends TAbortStrategy> extends ICreateResolvableTreeResolverOptionsResolveCallbackReturnedValue<TStrategy> {
  childrenOptions?: IRouteResolveCallbackOptions<TStrategy>;
}

export type TRouteResolveCallback = <TStrategy extends TAbortStrategy>(this: IRoute, options: IRouteResolveCallbackNormalizedOptions<TStrategy>) => ICancellablePromise<boolean, TStrategy>;

/* EXEC */

export interface IRouteExecCallbackOptions<TStrategy extends TAbortStrategy> extends ICancellablePromiseOptions<TStrategy> {
  path: string;
  routesPath: IRoute[];
  // params: TPathMatcherParams;
}

export type TRouteExecCallback = <TStrategy extends TAbortStrategy>(this: IRoute, options: IRouteExecCallbackOptions<TStrategy>) => ICancellablePromise<void, TStrategy>;

/* OPTIONS */

export interface IRouteOptions extends Omit<IResolvableTreeOptions, 'resolve' | 'isSelfResolvable' | 'children'> {
  children?: Iterable<IRoute>;
  resolve?: TRouteResolveCallback;
  exec?: TRouteExecCallback;
}


