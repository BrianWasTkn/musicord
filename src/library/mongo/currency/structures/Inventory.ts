import { StructureOptions, Structure } from '../..';
import { ItemHandler } from '../../..';

export class Inventory extends Structure {
	/**
	 * The expiring date for this bullshit.
	 */
	public expiresAt: number;
	/**
	 * The level of this egregious item.
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
		this.expiresAt = data.expire > Date.now() ? data.expire : 0;
		/** @type {number} */
		this.level = data.level;
		/** @type {number} */
		this.multiplier = data.expire > Date.now() ? data.multi : 0;
		/** @type {number} */
		this.owned = data.amount > 0 ? data.amount : 0;
		/** @type {number} */
		this.timesUsed = data.uses;
	}

	get item() {
		this
	}
}