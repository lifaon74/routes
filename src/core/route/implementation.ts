import { IPathMatcher } from '../path-matcher/interfaces';
import { IRoute } from './interfaces';
import { CancellablePromise, ICancellablePromise, IReadonlyList, TAbortStrategy } from '@lifaon/observables';
import {
  ICreateRouteResolverOptionsResolveCallbackReturnedValue, IRouteOptions, IRouteResolveCallbackNormalizedOptions,
  IRouteResolveCallbackOptions, IRouteResolveIncomingCallbackOptions, TRouteExecCallback
} from './types';
import { IRouteInternal, IRoutePrivate, ROUTE_PRIVATE } from './privates';
import { ConstructRoute } from './constructor';
import { IResolvableTree } from '../resolvable-tree/interfaces';
import { ResolvableTree } from '../resolvable-tree/implementation';
import { IResolvableTreeOptions, TResolvableTreeResolveCallback } from '../resolvable-tree/types';
import { CreateResolvableTreeResolver, ICreateResolvableTreeResolverOptions } from '../resolvable-tree/functions';
import { IPathMatcherResult } from '../path-matcher/types';
import { $super } from '../../misc/instance/snippets';

/** CONSTRUCTOR FUNCTIONS **/

export function CreateRouteResolver(): TResolvableTreeResolveCallback {
  return CreateResolvableTreeResolver({

    resolve<TStrategy extends TAbortStrategy>(
      this: IRoute,
      options: IRouteResolveIncomingCallbackOptions<TStrategy>
    ): ICancellablePromise<ICreateRouteResolverOptionsResolveCallbackReturnedValue<TStrategy>, TStrategy> {
      type TCPReturn = ICreateRouteResolverOptionsResolveCallbackReturnedValue<TStrategy>;

      const instance: IRoute = this;
      const privates: IRoutePrivate = (instance as IRouteInternal)[ROUTE_PRIVATE];
      const normalizedOptions: IRouteResolveCallbackNormalizedOptions<TStrategy> = options;
      const path: IPathMatcherResult | null = privates.pathMatcher.exec(normalizedOptions.path);

      if (path === null) {
        return CancellablePromise.resolve<TCPReturn, TStrategy>({ resolved: false }, normalizedOptions);
      } else {
        return (privates.resolve.call(instance, normalizedOptions) as ICancellablePromise<boolean, TStrategy>)
          .then((resolved: boolean): TCPReturn => {
            const childrenOptions: IRouteResolveCallbackOptions<TStrategy> | undefined = resolved
              ? ({
                ...normalizedOptions,
                path: path.remaining,
              })
              : void 0;

            const resolvePathOptions: IRouteResolveCallbackOptions<TStrategy> | undefined = childrenOptions;

            return {
              resolved,
              childrenOptions,
              resolvePathOptions,
            };
          });
      }
    },

    resolvePath<TStrategy extends TAbortStrategy>(
      this: IRoute,
      options: IRouteResolveIncomingCallbackOptions<TStrategy>,
      path: IRoute[]
    ): ICancellablePromise<IResolvableTree[], TStrategy> {
      const instance: IRoute = this;
      return CancellablePromise.try<IResolvableTree[], TStrategy>(() => {
        const isFinalRoute: boolean = (
          (options.path === '')
          && (instance.exec !== null)
        );

        if (path.length === 0) { // no children or no children resolved
          if (isFinalRoute) {
            return [instance];
          } else {
            return [];
          }
        } else {
          return [instance].concat(path);
        }
      }, options);
    }

  } as ICreateResolvableTreeResolverOptions);
}


const ROUTE_RESOLVER = CreateRouteResolver();

/** METHODS **/

/* GETTERS/SETTERS */

export function RouteGetPathMatcher(instance: IRoute): IPathMatcher {
  return (instance as IRouteInternal)[ROUTE_PRIVATE].pathMatcher;
}

export function RouteGetExec(instance: IRoute): TRouteExecCallback | null {
  return (instance as IRouteInternal)[ROUTE_PRIVATE].exec;
}


/** CLASS **/

export class Route extends ResolvableTree implements IRoute {
  constructor(path: string, options: IRouteOptions = {}) {
    const _options: IResolvableTreeOptions = {
      ...options,
      resolve: ROUTE_RESOLVER,
    };
    super(_options);
    ConstructRoute(this, path, options);
  }

  get children(): IReadonlyList<IRoute> {
    return $super(this, ResolvableTree).get('children');
    // return super.children as IReadonlyList<IRoute>;
  }

  get pathMatcher(): IPathMatcher {
    return RouteGetPathMatcher(this);
  }

  get exec(): TRouteExecCallback | null {
    return RouteGetExec(this);
  }

  resolve<TStrategy extends TAbortStrategy>(options: IRouteResolveCallbackOptions<TStrategy>): ICancellablePromise<IResolvableTree[], TStrategy> {
    return super.resolve<TStrategy>(options);
  }
}

