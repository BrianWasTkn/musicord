import { CurrencyEndpoint, SpawnEndpoint, LavaEndpoint, CribEndpoint } from 'lava/mongo';
import { Message, Structures } from 'discord.js';
import { UserPlus, Structure } from '.';
import { LavaClient } from 'lava/akairo';

export declare interface Context<Args extends {} = {}> extends Message {
	/**
	 * The client instance.
	 */
	client: LavaClient;
	/**
	 * The author.
	 */
	author: UserPlus;
}

export class Context<Args extends {} = {}> extends Message implements Structure {
	/**
	 * The command arguments.
	 */
	public args: Args = Object.create(null);

	/**
	 * Currency Endpoint shortcut.
	 * * Inventory - Manage user inventories.
	 * * Gamble - Manage gambling stats.
	 * * Quest - Manage user quests.
	 * * Pet - Manage user pets.
	 */
	public get currency(): CurrencyEndpoint {
		return this.client.db.currency;
	}

	/**
	 * Spawn Endpoint shortcut.
	 * * Events - Manage different event types.
	 */
	public get spawn(): SpawnEndpoint {
		return this.client.db.spawn;
	}

	/**
	 * Lava Endpoint shortcut.
	 * * Cooldowns - Manage command cooldowns.
	 * * Settings - Manage bot settings.
	 */
	public get lava(): LavaEndpoint {
		return this.client.db.lava;
	}

	/**
	 * Crib Endpoint shortcut.
	 * * Donations - Manage user donos.
	 * * Boosts - Manage boost perks.
	 */
	public get crib(): CribEndpoint {
		return this.client.db.crib;
	}
}

Structures.extend('Message', () => Context)