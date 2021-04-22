/**
 * Native types
 * @author brian
*/

// Global objects
type PromiseUnion<T> = T | Promise<T>;
type ArrayUnion<T> = T | T[];