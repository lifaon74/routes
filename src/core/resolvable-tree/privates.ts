import { IResolvableTree } from './interfaces';
import { IReadonlyList } from '@lifaon/observables';
import { TResolvableTreeResolveCallback } from './types';

/** PRIVATES **/

export const RESOLVABLE_TREE_PRIVATE = Symbol('resolvable-tree-private');

export interface IResolvableTreePrivate {
  children: IReadonlyList<IResolvableTree>;
  resolve: TResolvableTreeResolveCallback;
}

export interface IResolvableTreePrivatesInternal {
  [RESOLVABLE_TREE_PRIVATE]: IResolvableTreePrivate;
}

export interface IResolvableTreeInternal extends IResolvableTreePrivatesInternal, IResolvableTree {
}
