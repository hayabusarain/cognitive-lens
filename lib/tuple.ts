/** 長さ N に固定した配列の型。件数が違えば型チェックで失敗する（仕様書 5-2） */
export type Tuple<T, N extends number, R extends T[] = []> = R["length"] extends N ? R : Tuple<T, N, [...R, T]>;
