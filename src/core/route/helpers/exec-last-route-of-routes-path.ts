import { CancellablePromise, ICancellablePromise, TAbortStrategy } from '@lifaon/observables';
import { IRoute } from '../interfaces';
import { IRouteExecCallbackOptions, TRouteExecCallback } from '../types';


export function ExecLastRouteOfRoutesPath<TStrategy extends TAbortStrategy>(
  routesPath: IRoute[],
  options: IRouteExecCallbackOptions<TStrategy>
): ICancellablePromise<void, TStrategy> {
  let last: IRoute | null;
  if (
    (routesPath.length > 0)
    && ((last = routesPath[routesPath.length - 1]).exec !== null)
  ) {
    return (last.exec as TRouteExecCallback)(options);
  } else {
    return CancellablePromise.reject<void, TStrategy>(new Error(`The last route of routePath doesn't have an exec function`), options);
  }
}
