import { LavaClient, Base } from '..';
import { Document } from 'mongoose';

/**
 * The main entry with sets of methods to apply changes on our data.
 * @abstract @extends {Base}
*/
export abstract class UserEntry<Data extends Document> extends Base {
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
		super(client);

		/** @type {Data} */
		this.data = data;
	}

	/**
	 * Save all changes of the data from this entry.
	*/
	public save(): Promise<Data> {
		return this.data.save();
	}
}