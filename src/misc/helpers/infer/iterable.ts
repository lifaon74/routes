export type InferIterableValues<TIterable extends Iterable<any>> = TIterable extends Iterable<infer TValue> ? TValue : never;

/* KEY / VALUE */

export type InferKeyValueIterableKeys<TMap extends Iterable<[any, any]>> = TMap extends Iterable<[infer TKeys, any]> ? TKeys : never;
export type InferKeyValueIterableValues<TMap extends Iterable<[any, any]>> = TMap extends Iterable<[any, infer TValues]> ? TValues : never;

export type InferKeyValueIterableTupleKeys<TMaps extends Iterable<[any, any]>[]> = {
  [TKey in Extract<keyof TMaps, number>]: InferKeyValueIterableKeys<TMaps[TKey]>;
}[number];

export type InferKeyValueIterableTupleValues<TMaps extends Iterable<[any, any]>[]> = {
  [TKey in Extract<keyof TMaps, number>]: InferKeyValueIterableValues<TMaps[TKey]>;
}[number];
