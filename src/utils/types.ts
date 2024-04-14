/* eslint-disable @typescript-eslint/no-explicit-any */
export type PromiseType<T extends Promise<any>> =
  T extends Promise<infer U> ? U : never;

export type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;
