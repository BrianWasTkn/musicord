import { Document, Model } from 'mongoose';
import { LavaClient } from '..';
import { UserEntry } from '.';
import { Base } from 'discord.js';

export class MongooseEndpoint<Doc extends Document = never> extends Base {
	public client: LavaClient;
	public model: Model<Doc>;
	public constructor(client: LavaClient, model: Model<Doc>) {
		super(client);
		this.model = model;
	}

	async fetch(id: string): Promise<UserEntry<Doc>> {
		throw new Error(`[${this.constructor.name}] This method hasn't been implemented.`);
	}
}