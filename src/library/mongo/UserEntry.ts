import { LavaClient } from 'lava/akairo';
import { Document } from 'mongoose';

/**
 * The main entry with sets of methods to apply changes on our data.
 * @abstract @extends {Base}
*/
export abstract class UserEntry<Data extends Document> {
	/**
	 * The client instantiated this entry.
	*/
	public client: LavaClient;

	/**
	 * The data for this entry.
	*/
	public data: Data;

	/**
	 * The constructor for this entry.
	*/
	public constructor(client: LavaClient, data: Data) {
		/** @type {LavaClient} */
		this.client = client;
		/** @type {Data} */
		this.data = data;
	}

	/**
	 * Test for callbacks
	 */
	public callback(predicate: (entry: this) => this) {
		return predicate(this);
	}

	/**
	 * Save all changes of the data from this entry.
	*/
	public save(): Promise<this> {
		return this.data.save().then(() => this);
	}
}