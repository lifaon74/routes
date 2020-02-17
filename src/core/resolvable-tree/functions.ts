import { IResolvableTree } from './interfaces';
import {
  AdvancedAbortController, CancellablePromise, IAdvancedAbortSignal, ICancellablePromise, IsAdvancedAbortSignal,
  NormalizeICancellablePromiseOptions, TAbortStrategy
} from '@lifaon/observables';
import { IResolvableTreeResolveCallbackOptions, TResolvableTreeResolveCallback } from './types';
import { FreezeObjectProperties } from '../../misc/helpers/object/freeze-property';
import { PartiallyRequiredAndReadonly } from '../../misc/types/partialy-required-and-readonly';



/** FUNCTIONS **/

/* -- NORMALIZE -- */

/* IResolvableTreeResolveCallbackOptions */

export function NormalizeIResolvableTreeResolveCallbackOptionsSignal(signal?: IAdvancedAbortSignal): IAdvancedAbortSignal {
  if (signal === void 0) {
    return new AdvancedAbortController().signal;
  } else if (IsAdvancedAbortSignal(signal)) {
    return signal;
  } else {
    throw new TypeError(`Expected void or AdvancedAbortSignal as signal`);
  }
}

export function NormalizeIResolvableTreeResolveCallbackOptionsStrategy<TStrategy extends TAbortStrategy>(strategy?: TStrategy): TStrategy {
  if (strategy === void 0) {
    return 'never' as TStrategy;
  } else if (['never', 'resolve', 'reject'].includes(strategy)) {
    return strategy;
  } else {
    throw new TypeError(`Expected void, 'never', 'resolve' or 'reject' as strategy`);
  }
}


export type IResolvableTreeResolveCallbackNormalizedOptions<TStrategy extends TAbortStrategy> = PartiallyRequiredAndReadonly<IResolvableTreeResolveCallbackOptions<TStrategy>, 'strategy' | 'signal'>;

export function NormalizeIResolvableTreeResolveCallbackOptions<TStrategy extends TAbortStrategy>(
  options: IResolvableTreeResolveCallbackOptions<TStrategy>
): IResolvableTreeResolveCallbackNormalizedOptions<TStrategy> {
  return FreezeObjectProperties(NormalizeICancellablePromiseOptions(options), ['signal', 'strategy'] as ('signal'| 'strategy')[]);
}


/** HELPERS **/

export interface IResolveResolvableTreesOneByOneReducible {
  reduce<U>(callback: (previousValue: U, currentValue: IResolvableTree, ...args: any[]) => U, initialValue: U): U;
}

/**
 * For each 'tress', resolve it.
 *  - if it resolves with a path not empty, return this path
 *  - else, go to next tree and repeat
 */
export function ResolveResolvableTreesOneByOne<TStrategy extends TAbortStrategy>(
  trees: IResolveResolvableTreesOneByOneReducible,
  options: IResolvableTreeResolveCallbackOptions<TStrategy>,
): ICancellablePromise<IResolvableTree[], TStrategy> {
  return trees.reduce((promise: ICancellablePromise<IResolvableTree[], TStrategy>, tree: IResolvableTree) => {
    return promise.then((path: IResolvableTree[]) => {
      return (path.length === 0)
        ? tree.resolve(options)
        : path;
    });
  }, CancellablePromise.resolve<IResolvableTree[], TStrategy>([], options));
}


/* CREATE RESOLVER */

export interface ICreateResolvableTreeResolverOptionsResolveCallbackReturnedValue<TStrategy extends TAbortStrategy> {
  resolved: boolean;
  childrenOptions?: IResolvableTreeResolveCallbackOptions<TStrategy>;
  resolvePathOptions?: IResolvableTreeResolveCallbackOptions<TStrategy>;
}

export type TCreateResolvableTreeResolverOptionsResolveCallback = <TStrategy extends TAbortStrategy>(
  this: IResolvableTree,
  options: IResolvableTreeResolveCallbackNormalizedOptions<TStrategy>
) => ICancellablePromise<ICreateResolvableTreeResolverOptionsResolveCallbackReturnedValue<TStrategy>, TStrategy>;

export type TCreateResolvableTreeResolverOptionsResolvePathCallback = <TStrategy extends TAbortStrategy>(
  this: IResolvableTree,
  options: IResolvableTreeResolveCallbackNormalizedOptions<TStrategy>,
  path: IResolvableTree[]
) => ICancellablePromise<IResolvableTree[], TStrategy>;

export interface ICreateResolvableTreeResolverOptions {
  resolve?: TCreateResolvableTreeResolverOptionsResolveCallback;
  resolvePath?: TCreateResolvableTreeResolverOptionsResolvePathCallback;
}

export function CreateResolvableTreeResolver(
  resolverOptions: ICreateResolvableTreeResolverOptions = {}
): TResolvableTreeResolveCallback {

  const resolve: TCreateResolvableTreeResolverOptionsResolveCallback = (resolverOptions.resolve === void 0)
    ? <TStrategy extends TAbortStrategy>(
      options: IResolvableTreeResolveCallbackNormalizedOptions<TStrategy>
    ): ICancellablePromise<ICreateResolvableTreeResolverOptionsResolveCallbackReturnedValue<TStrategy>, TStrategy> => {
      return CancellablePromise.resolve<ICreateResolvableTreeResolverOptionsResolveCallbackReturnedValue<TStrategy>, TStrategy>({ resolved: true }, options);
    }
    : resolverOptions.resolve;

  const resolvePath: TCreateResolvableTreeResolverOptionsResolvePathCallback = (resolverOptions.resolvePath === void 0)
    ? function <TStrategy extends TAbortStrategy>(
      this: IResolvableTree,
      options: IResolvableTreeResolveCallbackNormalizedOptions<TStrategy>,
      path: IResolvableTree[]
    ): ICancellablePromise<IResolvableTree[], TStrategy> {
      const instance: IResolvableTree = this;
      return CancellablePromise.try<IResolvableTree[], TStrategy>(() => {
        return ((instance.children.length > 0) && (path.length === 0))
          ? []
          : [instance].concat(path);
      }, options);
    }
    : resolverOptions.resolvePath;

  return function <TStrategy extends TAbortStrategy>(
    this: IResolvableTree,
    options: IResolvableTreeResolveCallbackOptions<TStrategy>
  ): ICancellablePromise<IResolvableTree[], TStrategy> {
    const instance: IResolvableTree = this;
    const normalizedOptions: IResolvableTreeResolveCallbackNormalizedOptions<TStrategy> = NormalizeIResolvableTreeResolveCallbackOptions<TStrategy>(options);
    return (resolve.call(instance, normalizedOptions) as ICancellablePromise<ICreateResolvableTreeResolverOptionsResolveCallbackReturnedValue<TStrategy>, TStrategy>)
      .then((result: ICreateResolvableTreeResolverOptionsResolveCallbackReturnedValue<TStrategy>) => {
        if (result.resolved) {
          const childrenOptions: IResolvableTreeResolveCallbackOptions<TStrategy> = (result.childrenOptions === void 0)
            ? normalizedOptions
            : result.childrenOptions;

          return ResolveResolvableTreesOneByOne<TStrategy>(
            instance.children,
            childrenOptions
          )
            .then((path: IResolvableTree[]) => {
              const resolvePathOptions: IResolvableTreeResolveCallbackOptions<TStrategy> = (result.resolvePathOptions === void 0)
                ? normalizedOptions
                : result.resolvePathOptions;
              return (resolvePath.call(instance, resolvePathOptions, path) as ICancellablePromise<IResolvableTree[], TStrategy>);
            });
        } else {
          return [];
        }
      });
  };


}

