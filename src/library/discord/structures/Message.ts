import { LavaClient, CurrencyEndpoint, SpawnEndpoint } from '../..';
import { Message, Structures } from 'discord.js';
import { User, Base } from '.';

export class Context<Args extends {} = {}> extends Message implements Base {
	public client: LavaClient;
	public author: User;
	public args: Args;

	public get currency(): CurrencyEndpoint {
		return this.client.db.currency;
	}

	public get spawn(): SpawnEndpoint {
		return this.client.db.spawn;
	}
}

Structures.extend('Message', () => Context);