/**
 * Native types
 * @author brian
*/

// Global objects
type FunctionUnion<T> = T | (() => T);
type PromiseUnion<T> = T | Promise<T>;
type ArrayUnion<T> = T | T[];