import { Message, Structures } from 'discord.js';
import { LavaClient } from '../..';

export class Context<Args extends {} = never> extends Message {
	public client: LavaClient;
	public args: Args = Object.create(null);

	public getUser = (id = this.author.id) => ({
		currency: () => this.client.db.currency.fetch(id)
	});
}

Structures.extend('Message', () => Context);