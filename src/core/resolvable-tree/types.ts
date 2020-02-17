import { ICancellablePromise, ICancellablePromiseOptions, TAbortStrategy } from '@lifaon/observables';
import { IResolvableTree } from './interfaces';

/** TYPES */

export interface IResolvableTreeResolveCallbackOptions<TStrategy extends TAbortStrategy> extends ICancellablePromiseOptions<TStrategy> {
}

// export interface IResolvableTreeResolveCallbackReturnedValue<TStrategy extends TAbortStrategy> {
//   resolved: boolean;
//   childrenOptions?: IResolvableTreeResolveCallbackOptions<TStrategy>;
// }

export type TResolvableTreeResolveCallback = <TStrategy extends TAbortStrategy>(options: IResolvableTreeResolveCallbackOptions<TStrategy>) => ICancellablePromise<IResolvableTree[], TStrategy>;

export interface IResolvableTreeOptions {
  resolve: TResolvableTreeResolveCallback;
  children?: Iterable<IResolvableTree>;
}

