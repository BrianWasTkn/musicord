import { ItemHandler, StructureOptions, Structure } from 'src/library';

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
	public constructor(options: StructureOptions, data: CurrencyInventory) {
		super(options);
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

	get item() {
		const plugin = this.client.plugins.plugins.get('Item');
		return (plugin.handler as ItemHandler).modules.get(this.id);
	}

	isOwned() {
		return this.owned > 0;
	}

	isActive() {
		return this.isOwned() && this.expiration > Date.now();
	}
}