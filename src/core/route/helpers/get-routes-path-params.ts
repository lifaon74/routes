import { IRoute } from '../interfaces';
import { IPathMatcherResult, TPathMatcherParams } from '../../path-matcher/types';
import { MergeMaps } from '../../../misc/helpers/map/merge';

/**
 * Returns, from a 'routesPath' matching a 'path', a map of params and their values
 * @Example: (abstract pseudo code)
 *  GetRoutesPathParams(['/:a', '/:b'], '/1/2') => { a: 1, b: 2 }
 */
export function GetRoutesPathParams(routesPath: IRoute[], path: string): TPathMatcherParams {
  const params: Map<string, string> = new Map<string, string>();

  for (let i = 0, l = routesPath.length; i < l; i++) {
    const route: IRoute = routesPath[i];
    const result: IPathMatcherResult | null = route.pathMatcher.exec(path);
    if (result === null) {
      throw new Error(`The routePath doesn't match the path`);
    } else {
      MergeMaps(params, result.params);
      path = result.remaining;
    }
  }

  return params;
}
