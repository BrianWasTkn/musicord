import { Message, Structures } from 'discord.js';
import { LavaClient } from '../..';
import { User } from '.';

export class Context<Args extends {} = {}> extends Message {
	public client: LavaClient;
	public author: User;
	public args: Args = Object.create(null);

	public currency(id = this.author.id) {
		return this.client.db.currency.fetch(id);
	}
}

Structures.extend('Message', () => Context);