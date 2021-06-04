import { ItemHandler, LavaClient, Structure } from 'lava/index';

export class Inventory extends Structure {
	/**
	 * The expiring date for this bullshit.
	 */
	public expiration: number;
	/**
	 * The level of this sPEcIaL item.
	 */
	public level: number;
	/**
	 * The multiplier shit of this item.
	 */
	public multiplier: number;
	/**
	 * The amount of shits they own.
	 */
	public owned: number;
	/**
	 * The amount of times they pleasured this item.
	 */
	public timesUsed: number;

	/**
	 * The constructor for this bullshit.
	 */
	public constructor(client: LavaClient, data: CurrencyInventory) {
		super({ client, id: data.id });
		/** @type {number} */
		this.expiration = data.expire;
		/** @type {number} */
		this.level = data.level;
		/** @type {number} */
		this.multiplier = data.multi;
		/** @type {number} */
		this.owned = data.amount;
		/** @type {number} */
		this.timesUsed = data.uses;
	}

	/**
	 * Shortcut to the item module this item belongs to.
	 */
	get module() {
		const { handler } = this.client.plugins.plugins.get('item');
		return (handler as ItemHandler).modules.get(this.id);
	}

	/**
	 * Check if they own this item.
	 */
	isOwned() {
		return this.owned > 0;
	}

	/**
	 * Check if they own this item and expiration date is ahead of now.
	 */
	isActive() {
		return this.isOwned() && this.expiration > Date.now();
	}
}