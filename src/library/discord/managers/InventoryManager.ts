import { Inventory, CurrencyEntry } from 'lava/mongo';
import { BaseManager, Collection } from 'discord.js';
import { Item, LavaClient } from 'lava/akairo';

export type InventoryResolvable = Inventory | string;

export declare interface InventoryManager extends BaseManager<string, Inventory, InventoryResolvable> {
	readonly client: LavaClient;
}

export class InventoryManager extends BaseManager<string, Inventory, InventoryResolvable> {
	/** The user entry for currency stuff. */
	public entry: CurrencyEntry;

	/** Construct an inventory manager. */
	public constructor(entry: CurrencyEntry, iterable: Collection<string, Inventory>) {
		super(entry.client, iterable, Inventory, new Collection<string, Inventory>());
		/** @type {CurrencyEntry} */
		this.entry = entry;
	}

	/** Add an item into this inventory. */
	add(data: CurrencyInventory) {
		if (this.cache.has(data.id)) return this.cache.get(data.id);
		return super.add(data, true);
	}
}