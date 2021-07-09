import { LavaClient, AbstractHandler } from 'lava/akairo';
import { Document, Model } from 'mongoose';
import { AkairoHandler } from 'discord-akairo';
import { EventEmitter } from 'events';
import { UserEntry } from '.';

/**
 * Our endpoint for all db collections.
*/
export abstract class Endpoint<Doc extends Document = never> extends EventEmitter {
	/**
	 * The client instantiated this endpoint.
	*/
	public client: LavaClient;
	/**
	 * The model for this endpoint.
	 * @readonly
	*/
	public readonly model: Model<Doc>;

	/**
	 * The constructor for this endpoint.
	*/
	public constructor(client: LavaClient, model: Model<Doc>) {
		super();
		/** @type {LavaClient} */
		this.client = client;
		/** @type {Model<Doc>} */
		this.model = model;
	}

	/**
	 * Fetch a document from the model of this endpoint based from the given id.
	*/
	public abstract fetch(_id: string): Promise<UserEntry<Doc>>;
}