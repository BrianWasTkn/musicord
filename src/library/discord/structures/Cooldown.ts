import { LavaClient } from '../..';
import { Base } from 'discord.js';

export class Cooldown extends Base {
	public client: LavaClient;

	public multiplier: number;
	public timesUsed: number;
	public expiresAt: number;
	public owned: number;
	public level: number;
	public id: string;
	public constructor(client: LavaClient, data: CooldownData) {
		super(client);

		/**
		 * ID of this item.
		*/
		this.id = data.id;

		/**
		 * Expiration date of this item.
		*/
		this.expiresAt = data.expire;
	}

	/**
	 * Shortcut for returning the inventory item as an item module.
	*/
	get command() {
		return this.client.commandHandler.modules.get(this.id);
	}

	/**
	 * Check if cooldown is active.
	*/
	isActive() {
		return this.expiresAt > Date.now();
	}
}