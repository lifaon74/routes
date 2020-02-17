import { PartiallyReadOnly } from '../../types/partialy-readonly';
import { InferIterableValues } from '../infer/iterable';

export function FreezeObjectProperty<TObject extends object, TKey extends keyof TObject>(target: TObject, propertyKey: TKey): PartiallyReadOnly<TObject, TKey> {
  const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(target, propertyKey);
  if (descriptor === void 0) {
    throw new Error(`Missing property ${ String(propertyKey) }`);
  } else {
    const value: any = target[propertyKey];
    Object.defineProperty(target, propertyKey, {
      enumerable: descriptor.enumerable,
      configurable: false,
      get: () => value,
    });
  }

  return target;
}

export function FreezeObjectProperties<TObject extends object, TKeys extends Iterable<keyof TObject>>(
  target: TObject,
  propertyKeys: TKeys
): PartiallyReadOnly<TObject, InferIterableValues<TKeys>> {
  const iterator: Iterator<keyof TObject> = propertyKeys[Symbol.iterator]();
  let result: IteratorResult<keyof TObject>;
  while (!(result = iterator.next()).done) {
    FreezeObjectProperty<TObject, InferIterableValues<TKeys>>(target, result.value);
  }
  return target;
}
