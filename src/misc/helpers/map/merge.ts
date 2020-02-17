import {
  InferKeyValueIterableKeys, InferKeyValueIterableTupleKeys, InferKeyValueIterableTupleValues,
  InferKeyValueIterableValues
} from '../infer/iterable';


export type InferMergeMapsReturn<TFirstMap extends Map<any, any>, TMaps extends Iterable<[any, any]>[]> =
  Map<InferKeyValueIterableKeys<TFirstMap> | InferKeyValueIterableTupleKeys<TMaps>, InferKeyValueIterableValues<TFirstMap> | InferKeyValueIterableTupleValues<TMaps>>;

/**
 * Merges N maps into the first map
 */
export function MergeMaps<TFirstMap extends Map<any, any>, TMaps extends Iterable<[any, any]>[]>(firstMap: TFirstMap, ...maps: TMaps): InferMergeMapsReturn<TFirstMap, TMaps> {
  const mergedMap: InferMergeMapsReturn<TFirstMap, TMaps> = firstMap;
  type TIterableValues = [InferKeyValueIterableTupleKeys<TMaps>, InferKeyValueIterableTupleValues<TMaps>];
  for (let i = 0, l = maps.length; i < l; i++) {
    const map: Iterable<TIterableValues> = maps[i];
    const iterator: Iterator<TIterableValues> = map[Symbol.iterator]();
    let result: IteratorResult<TIterableValues>;
    while (!(result = iterator.next()).done) {
      mergedMap.set(result.value[0], result.value[1]);
    }
  }
  return mergedMap;
}

// export function MergeMaps<TMaps extends Map<any, any>[]>(...maps: TMaps): TMergeMap<TMaps> {
//   if (maps.length === 0) {
//     throw new Error(`Expects at least one argument`);
//   } else {
//     // const mergedMap: TMergeMap<TMaps> = new Map<TMergeMapKeys<TMaps>, TMergeMapValues<TMaps>>();
//     const mergedMap: TMergeMap<TMaps> = maps[0];
//     for (let i = 1, l = maps.length; i < l; i++) {
//       const map: TMergeMap<TMaps> = maps[i];
//       const iterator: Iterator<[TMergeMapKeys<TMaps>, TMergeMapValues<TMaps>]> = map.entries();
//       let result: IteratorResult<[TMergeMapKeys<TMaps>, TMergeMapValues<TMaps>]>;
//       while (!(result = iterator.next()).done) {
//         mergedMap.set(result.value[0], result.value[1]);
//       }
//     }
//     return mergedMap;
//   }
// }
