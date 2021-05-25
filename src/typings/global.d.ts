
/**
 * Global custom types.
*/
export declare global {
	import { Collection, Snowflake } from 'discord.js';

	/**
	 * Cast a union type of promises and not.
	*/
	type PromiseUnion<T> = Promise<T> | T;

	/**
	 * Cast a union of arrays and the other.
	*/
	type ArrayUnion<T> = Array<T> | T;

	/**
	 * Cast a collection with a key to value pair.
	*/
	type CollectionFlake<V> = Collection<Snowflake, V>;
}