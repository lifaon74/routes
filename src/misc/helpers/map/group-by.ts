export function MapGroupBy<TData, TKey extends keyof TData>(data: Iterable<TData>, key: TKey): Map<TData[TKey], TData[]> {
  const map = new Map<TData[TKey], TData[]>();
  const iterator: Iterator<TData> = data[Symbol.iterator]();
  let result: IteratorResult<TData>;
  while (!(result = iterator.next()).done) {
    let array: TData[];
    const value: any = result.value[key];
    if (map.has(value)) {
      array = map.get(value) as TData[];
    } else {
      array = [];
      map.set(value, array);
    }

    array.push(result.value);
  }
  return map;
}

