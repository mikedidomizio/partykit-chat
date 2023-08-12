// https://stackoverflow.com/questions/53276792/define-a-list-of-optional-keys-for-typescript-record
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
