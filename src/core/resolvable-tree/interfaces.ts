import { ICancellablePromise, IReadonlyList, TAbortStrategy } from '@lifaon/observables';
import { IResolvableTreeOptions, IResolvableTreeResolveCallbackOptions } from './types';

/** INTERFACES */

export interface IResolvableTreeConstructor {
  new(options: IResolvableTreeOptions): IResolvableTree;
}

export interface IResolvableTree {
  readonly children: IReadonlyList<IResolvableTree>;

  resolve<TStrategy extends TAbortStrategy>(options: IResolvableTreeResolveCallbackOptions<TStrategy>): ICancellablePromise<IResolvableTree[], TStrategy>;
}



