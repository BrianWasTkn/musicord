import { LavaClient } from '../..';
import { Base } from '.';

export class Inventory extends Base {
	public multiplier: number;
	public timesUsed: number;
	public expiresAt: number;
	public owned: number;
	public level: number;
	public id: string;
	public constructor(client: LavaClient, data: CurrencyInventory) {
		super(client);

		/**
		 * ID of this item.
		*/
		this.id = data.id;

		/**
		 * Owned amount of this item.
		*/
		this.owned = data.amount ?? 0;

		/**
		 * Expiration date of this item.
		*/
		this.expiresAt = data.expire ?? 0;

		if ('multi' in data) {
			/**
			 * The multiplier effects of this item.
			*/
			this.multiplier = data.multi;
		}

		/**
		 * How many times the user used this item.
		*/
		this.timesUsed = data.uses ?? 0;

		/**
		 * The level upgrade of this item.
		*/
		this.level = data.level ?? 0;
	}

	/**
	 * Shortcut for returning the inventory item as an item module.
	*/
	get item() {
		return this.client.itemHandler.modules.get(this.id);
	}

	/**
	 * Check if they own at least one of this item.
	*/
	isOwned() {
		return this.owned >= 1;
	}

	/**
	 * Check it's active state.
	*/
	isActive() {
		return this.isOwned() && this.expiresAt > Date.now();
	}
}