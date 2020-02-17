export type PartiallyRequiredAndReadonly<T, K extends keyof T> = Omit<T, K> & Readonly<Required<Pick<T, K>>>;
