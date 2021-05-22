import { LavaClient } from '..';
import { Document } from 'mongoose';
import { Base } from 'discord.js';

export abstract class UserEntry<Data extends Document> extends Base {
	public client: LavaClient;
	public data: Data;
	public constructor(client: LavaClient, data: Data) {
		super(client);
		this.data = data;
	}

	public save(): Promise<Data> {
		return this.data.save();
	}
}