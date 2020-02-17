import { IRoute } from '../interfaces';
import {
  ICancellablePromise, ICancellablePromiseNormalizedOptions, ICancellablePromiseOptions,
  NormalizeICancellablePromiseOptions, Reason, TAbortStrategy
} from '@lifaon/observables';
import { ExecLastRouteOfRoutesPath } from './exec-last-route-of-routes-path';
import { GetRoutesPathParams } from './get-routes-path-params';
import { IRouteExecCallbackOptions } from '../types';
import { TPathMatcherParams } from '../../path-matcher/types';
import { IResolvableTree } from '../../resolvable-tree/interfaces';

export interface IResolveAndExecLastRouteOptions<TStrategy extends TAbortStrategy> extends ICancellablePromiseOptions<TStrategy> {
  path: string;
}

export interface IResolveAndExecLastRouteNormalizedOptions<TStrategy extends TAbortStrategy> extends Pick<IResolveAndExecLastRouteOptions<TStrategy>, 'path'>,
  ICancellablePromiseNormalizedOptions<TStrategy> {
}

export interface IResolveAndExecLastRouteCallbackOptions<TStrategy extends TAbortStrategy> extends IRouteExecCallbackOptions<TStrategy> {
  params: TPathMatcherParams;
}

export function ResolveAndExecLastRoute<TStrategy extends TAbortStrategy>(
  route: IRoute,
  options: IResolveAndExecLastRouteOptions<TStrategy>
): ICancellablePromise<void, TStrategy> {
  const _options: IResolveAndExecLastRouteNormalizedOptions<TStrategy> = NormalizeICancellablePromiseOptions<TStrategy>(options) as IResolveAndExecLastRouteNormalizedOptions<TStrategy>;

  return route.resolve<TStrategy>(_options)
    .then((routesPath: IResolvableTree[]) => {
      if (routesPath.length === 0) {
        throw new Reason(`Cannot resolve the path '${ _options.path }'`, 'INVALID_PATH');
      } else {
        return ExecLastRouteOfRoutesPath(routesPath as IRoute[], {
          ..._options,
          routesPath,
          params: GetRoutesPathParams(routesPath as IRoute[], _options.path),
        } as IResolveAndExecLastRouteCallbackOptions<TStrategy>);
      }
    });
}

