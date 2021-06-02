/**
 * Global custom types.
*/
export declare global {
	import { Collection, Snowflake } from 'discord.js';

	/**
	 * Cast a union type of a promise and a not.
	*/
	type PromiseUnion<T> = Promise<T> | T;

	/**
	 * Cast a union of an array and a not.
	*/
	type ArrayUnion<T> = Array<T> | T;

	/**
	 * Cast a union of a partial object and a not.
	*/
	type PartialUnion<T> = Partial<T> | T;

	/**
	 * Cast a collection with a key string to value pair.
	*/
	type CollectionFlake<V> = Collection<Snowflake, V>;

	/**
	 * Custom console interface.
	*/
	interface Console {
		/** 
		 * Logs to stdin.
		*/
		log(tag: string, ...message: any[]): void;
	}
}