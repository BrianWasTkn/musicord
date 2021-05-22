/// <reference path="../../../typings/mongo.currency.d.ts" />

import { LavaClient } from '../..';
import { Base } from 'discord.js';

export class Inventory extends Base {
	public client: LavaClient;

	public multiplier: number;
	public timesUsed: number;
	public expiresAt: number;
	public owned: number;
	public id: string;
	public constructor(client: LavaClient, data: InventorySlot) {
		super(client);

		/**
		 * ID of this item.
		*/
		this.id = data.id;

		/**
		 * Owned amount of this item.
		*/
		this.owned = data.amount;

		/**
		 * Expiration date of this item.
		*/
		this.expiresAt = data.expire;

		if ('multi' in data) {
			/**
			 * The multiplier effects of this item.
			*/
			this.multiplier = data.multi;
		}

		/**
		 * How many times the user used this item.
		*/
		this.timesUsed = data.consumed;
	}

	/**
	 * Shortcut for returning the inventory item as an item module.
	*/
	get item() {
		return this.client.itemHandler.modules.get(this.id);
	}

	/**
	 * Check if it's "in" the inventory.
	*/
	isOwned() {
		return this.owned >= 1;
	}

	/**
	 * Check it's active state.
	*/
	isActive() {
		return this.owned >= 1 && this.expiresAt > Date.now();
	}
}