import { Route } from '../core/route/implementation';
import { assert } from '../misc/helpers/asserts';
import {
  CancellablePromise, IAdvancedAbortSignal, ICancellablePromise, ICancellablePromiseOptions, TAbortStrategy,
  TPromiseOrValue
} from '@lifaon/observables';
import { IRoute } from '../core/route/interfaces';
import {
  IResolveAndExecLastRouteCallbackOptions, ResolveAndExecLastRoute
} from '../core/route/helpers/resolve-and-exec-last-route';
import { HTTPRoute } from '../built-in/http-route/implementation';
import {
  IResolveAndExecLastHTTPRouteCallbackOptions, ResolveAndExecLastHTTPRoute
} from '../built-in/http-route/helpers/resolve-and-exec-last-http-route';
import { HTTPMethod } from '../built-in/http-route/types';
import { IHTTPRoute } from '../built-in/http-route/interfaces';

const $try = <T>(callback: <TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => TPromiseOrValue<T>) => {
  return function <TStrategy extends TAbortStrategy>(this: any, options: ICancellablePromiseOptions<TStrategy>): ICancellablePromise<T, TStrategy> {
    return CancellablePromise.try<T, TStrategy>((signal: IAdvancedAbortSignal) => {
      return callback.call(this, {
        ...options,
        signal
      });
    }, options);
  };
};

const $resolveAndExecLastRoute = (route: IRoute, path: string): Promise<void> => {
  return ResolveAndExecLastRoute(route, { path }).promise;
};

const $resolveAndExecLastHTTPRoute = (route: IHTTPRoute, path: string, method: HTTPMethod): Promise<void> => {
  return ResolveAndExecLastHTTPRoute(route, { path, method }).promise;
};


export async function debugBaseRoute() {

  const route = new Route('/', {
    children: [
      new Route('/route1', {
        exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
          console.log('route 1 resolved');
        }),
      }),
      new Route('/route2/:id', {
        exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
          console.log('route 2 resolved', (options as IResolveAndExecLastRouteCallbackOptions<TStrategy>).params);
        }),
        children: [
          new Route('/child', {
            exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
              console.log('route 2 child resolved', (options as IResolveAndExecLastRouteCallbackOptions<TStrategy>).params);
            })
          }),
        ]
      }),
      new Route('/route3', {
        exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
          console.log('route 3 resolved', (options as IResolveAndExecLastRouteCallbackOptions<TStrategy>).params);
        }),
        children: [
          new Route('/child', {
            exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
              console.log('route 3 child resolved', (options as IResolveAndExecLastRouteCallbackOptions<TStrategy>).params);
            })
          }),
        ]
      }),
      new Route('/route4/**', {
        exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
          console.log('route 4 resolved');
        })
      }),
    ]
  });

  const resolve = (route: IRoute, path: string): Promise<IRoute[]> => {
    return route.resolve<'never'>({ path, strategy: 'never' }).promise as Promise<IRoute[]>;
  };

  const assertResolveEmpty = (route: IRoute, path: string) => {
    return assert(async () => (await resolve(route, path)).length === 0)
      .catch(() => {
        throw new Error(`Assert failed: '${ path }' resolved`);
      });
  };

  // console.log(await resolve(route, '/route3/undefined'));
  // console.log(await resolve(route, '/route3'));

  await assertResolveEmpty(route, '/');
  await assertResolveEmpty(route, '/route2');
  await assertResolveEmpty(route, '/route1/undefined');
  await assertResolveEmpty(route, '/route3/undefined');

  await $resolveAndExecLastRoute(route, '/route1');
  await $resolveAndExecLastRoute(route, '/route2/48');
  await $resolveAndExecLastRoute(route, '/route3');
  await $resolveAndExecLastRoute(route, '/route3/child');
  await $resolveAndExecLastRoute(route, '/route2/123/child');
}

export async function debugRouteWithDefault() {
  const route = new Route('/', {
    children: [
      new Route('/route1', {
        exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
          console.log('route 1 resolved');
        })
      }),
      new Route('/route2**', {
        exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
          console.log('route 2 wildcard resolved');
        })
      }),
      new Route('/**', {
        exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
          console.log('route default resolved');
        })
      }),
    ]
  });

  await $resolveAndExecLastRoute(route, '/route1'); // => route 1 resolved
  await $resolveAndExecLastRoute(route, '/route1/'); // => route 1 resolved
  await $resolveAndExecLastRoute(route, '/route2'); // => route 2 wildcard resolved
  await $resolveAndExecLastRoute(route, '/route2/48'); // => route 2 wildcard resolved
  await $resolveAndExecLastRoute(route, '/route3'); // => route default resolved
  await $resolveAndExecLastRoute(route, '/route3/child'); // => route default resolved
  await $resolveAndExecLastRoute(route, '/'); // => route default resolved
}

export async function debugHTTPRoute() {
  const route = new HTTPRoute('/', {
    children: [
      new HTTPRoute('/route1', {
        methods: ['GET'] as ('GET'[]),
        exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
          console.log('route 1 GET resolved');
        })
      }),
      new HTTPRoute('/route1', {
        exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
          console.log('route 1 ANY resolved');
        })
      }),
      new HTTPRoute('/**', {
        exec: $try(<TStrategy extends TAbortStrategy>(options: ICancellablePromiseOptions<TStrategy>) => {
          console.log('route default resolved');
        })
      }),
    ]
  });

  await $resolveAndExecLastHTTPRoute(route, '/route1', 'GET'); // route 1 GET resolved
  await $resolveAndExecLastHTTPRoute(route, '/route1', 'POST'); // route 1 ANY resolved
  await $resolveAndExecLastHTTPRoute(route, '/404', 'POST'); // route default resolved
}

export async function debugRoute() {
  // await debugBaseRoute();
  // await debugRouteWithDefault();
  await debugHTTPRoute();
}
