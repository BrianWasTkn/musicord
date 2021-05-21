/**
 * Native types
 * @author brian
*/

// Global objects
type FunctionUnion<T, A extends any[] = []> = T | ((...args: A) => T);
type PromiseUnion<T> = T | Promise<T>;
type ArrayUnion<T> = T | T[];