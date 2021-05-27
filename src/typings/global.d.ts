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
	 * Cast a union of partial objects.
	*/
	type PartialUnion<T> = Partial<T> | T;

	/**
	 * Alias for ConstructorParameters.
	*/
	type ClassParam<T> = ConstructorParameters<typeof T>;

	/**
	 * Alias for Parameters.
	*/
	type Param<T> = Parameters<typeof T>;

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
		log(key: string, ...message: any[]): void;
	}
}