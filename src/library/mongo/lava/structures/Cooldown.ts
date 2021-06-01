import { LavaClient, Structure } from 'src/library';

export class LavaCooldown extends Structure {
	/**
	 * Expiration time for this cooldown.
	 */
	public expiresAt: number;
	/**
	 * ID of this command.
	 */
	public id: string;
	/**
	 * Constructor for this bullshit.
	 */
	public constructor(client: LavaClient, data: LavaCooldowns) {
		super({ client, id: data.id });
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