import { Document, Model } from 'mongoose';
import { Snowflake } from 'discord.js';
import { Lava } from '@lib/Lava';

export abstract class BaseEndpoint<Profile extends Document> {
	private model: Model<Document<Profile>>;
	public client: Lava;

	constructor(client: Lava, model: Model<Document<Profile>>) {
		this.client = client;
		this.model = model;
	}

	abstract fetch = (id: Snowflake): Promise<Profile> => {
		throw new Error(`This method hasn't been implemented.`);
	}
}