import { LavaClient } from '../..';
import { Base } from '.';

export class LavaCooldown extends Base {
	public expiresAt: number;
	public id: string;
	public constructor(client: LavaClient, data: LavaCooldowns) {
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
	 * Shortcut for returning the cooldown as a command module.
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