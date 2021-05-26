import { Document, Model } from 'mongoose';
import { LavaClient } from '..';
import { UserEntry } from '.';
import { Base } from 'discord.js';

/**
 * Our endpoint for all db collections.
*/
export class Endpoint<Doc extends Document = never> extends Base {
	/**
	 * The model for this endpoint.
	 * @readonly
	*/
	public readonly model: Model<Doc>;

	/**
	 * The client instantiated this endpoint.
	*/
	public client: LavaClient;

	/**
	 * The constructor for this endpoint.
	*/
	public constructor(client: LavaClient, model: Model<Doc>) {
		super(client);

		/** @type {Model<Doc>} */
		this.model = model;
	}

	/**
	 * Create an instance of this endpoint if you don't want instantiating with "new"
	 * @static
	*/
	public static createInstance(...args: ConstructorParameters<typeof Endpoint>) {
		return new this(...args);
	}

	/**
	 * Fetch a document from the model of this endpoint based from the given id.
	*/
	public async fetch(id: string): Promise<UserEntry<Doc>> {
		throw new Error(`[${this.constructor.name}] This method hasn't been implemented.`);
	}
}