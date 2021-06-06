import { LavaClient, AbstractHandler } from '..';
import { Document, Model } from 'mongoose';
import { AkairoHandler } from 'discord-akairo';
import { UserEntry } from '.';
import { Base } from 'discord.js';

export declare interface Endpoint<Doc extends Document = never> extends Base {
	/**
	 * The client instantiated this endpoint.
	*/
	client: LavaClient;
}

/**
 * Our endpoint for all db collections.
*/
export abstract class Endpoint<Doc extends Document = never> extends Base {
	/**
	 * The model for this endpoint.
	 * @readonly
	*/
	public readonly model: Model<Doc>;

	/**
	 * The constructor for this endpoint.
	*/
	public constructor(client: LavaClient, model: Model<Doc>) {
		super(client);
		/** @type {Model<Doc>} */
		this.model = model;
	}

	/**
	 * Fetch a document from the model of this endpoint based from the given id.
	*/
	public abstract fetch(id: string): Promise<UserEntry<Doc>>;
}