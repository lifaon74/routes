import { IResolvableTree } from './interfaces';
import { IResolvableTreeInternal, IResolvableTreePrivate, RESOLVABLE_TREE_PRIVATE } from './privates';
import { IResolvableTreeOptions } from './types';
import { ConstructClassWithPrivateMembers } from '../../misc/helpers/ClassWithPrivateMembers';
import { IsObject } from '../../misc/helpers/is/IsObject';
import { ReadonlyList } from '@lifaon/observables';

/** CONSTRUCTOR **/

export function ConstructResolvableTree(
  instance: IResolvableTree,
  options: IResolvableTreeOptions
): void {
  ConstructClassWithPrivateMembers(instance, RESOLVABLE_TREE_PRIVATE);
  const privates: IResolvableTreePrivate = (instance as IResolvableTreeInternal)[RESOLVABLE_TREE_PRIVATE];

  if (IsObject(options)) {
    if (options.children === void 0) {
      privates.children = new ReadonlyList<IResolvableTree>([]);
    } else if (Symbol.iterator in options.children) {
      const children: IResolvableTree[] = Array.from(options.children);
      for (let i = 0, l = children.length; i < l; i++) {
        if (!IsResolvableTree(children[i])) {
          throw new TypeError(`Expected ResolvableTree at index #${ i } of options.children`);
        }
      }
      privates.children = new ReadonlyList<IResolvableTree>(children);
    } else {
      throw new TypeError(`Expected iterable as options.children`);
    }

    if (typeof options.resolve === 'function') {
      privates.resolve = options.resolve;
    } else {
      throw new TypeError(`Expected function as options.resolve`);
    }
  } else {
    throw new TypeError(`Expected void or object as options`);
  }
}

export function IsResolvableTree(value: any): value is IResolvableTree {
  return IsObject(value)
    && value.hasOwnProperty(RESOLVABLE_TREE_PRIVATE as symbol);
}
