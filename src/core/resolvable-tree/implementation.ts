import { IResolvableTree } from './interfaces';
import { IResolvableTreeOptions, IResolvableTreeResolveCallbackOptions } from './types';
import { IResolvableTreeInternal, RESOLVABLE_TREE_PRIVATE } from './privates';
import { ConstructResolvableTree } from './constructor';
import { ICancellablePromise, IReadonlyList, TAbortStrategy } from '@lifaon/observables';


/** METHODS **/

/* GETTERS/SETTERS */

export function ResolvableTreeGetChildren(instance: IResolvableTree): IReadonlyList<IResolvableTree> {
  return (instance as IResolvableTreeInternal)[RESOLVABLE_TREE_PRIVATE].children;
}


/* METHODS */

export function ResolvableTreeResolve<TStrategy extends TAbortStrategy>(
  instance: IResolvableTree,
  options: IResolvableTreeResolveCallbackOptions<TStrategy>
): ICancellablePromise<IResolvableTree[], TStrategy> {
  return ((instance as IResolvableTreeInternal)[RESOLVABLE_TREE_PRIVATE].resolve.call(instance, options) as ICancellablePromise<IResolvableTree[], TStrategy>);
}


/** CLASS **/

export class ResolvableTree implements IResolvableTree {
  constructor(options: IResolvableTreeOptions) {
    ConstructResolvableTree(this, options);
  }

  get children(): IReadonlyList<IResolvableTree> {
    return ResolvableTreeGetChildren(this);
  }

  resolve<TStrategy extends TAbortStrategy>(options: IResolvableTreeResolveCallbackOptions<TStrategy>): ICancellablePromise<IResolvableTree[], TStrategy> {
    return ResolvableTreeResolve<TStrategy>(this, options);
  }
}

