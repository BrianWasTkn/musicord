import { AbstractHandlerOptions, AbstractHandler, LavaClient, Item } from 'lava/akairo';
import { Collection, Snowflake } from 'discord.js';
import { ItemEffects } from 'lava/utility';

export interface ItemHandlerOptions extends AbstractHandlerOptions {
	/**
	 * The sale interval in ms.
	 */
	saleInterval?: number;
}

export interface ItemSale {
	/**
	 * The discount from 1% to 65%
	 */
	discount?: number;
	/**
	 * The stamp when the next sale would be.
	 */
	nextSale?: number;
	/**
	 * The item on sale.
	 */
	item?: Item;
}

export class ItemHandler extends AbstractHandler<Item> {
	/**
	 * The sale item.
	 */
	public sale: ItemSale = {};
	/**
	 * Item effects mapped from snowflake to item to effects.
	 */
	public effects: Collection<Snowflake, Collection<string, ItemEffects>> = new Collection();
	/**
	 * The sale interval
	 */
	public saleInterval: number;

	/**
	 * Construct an item handler.
	 */
	public constructor(client: LavaClient, options: ItemHandlerOptions) {
		super(client, options);
		/** @type {number} */
		this.saleInterval = options.saleInterval ?? 1000 * 60 * 15;

		/**
		 * Sale Item.
		*/
		this.client.once('ready', () => {
			if (!this.modules.size) return;
			this.setSaleItem();
			setInterval(() => this.setSaleItem(), this.saleInterval);
		});
	}

	/**
	 * Sets the sale item.
	 */
	private setSaleItem(): ItemSale {
		const { randomInArray, randomNumber } = this.client.util;
		const items = [...this.modules.values()];
		const discount = randomNumber(1, 100);
		const item = randomInArray(items);
		const nextSale = (this.sale.nextSale ?? Date.now()) + this.saleInterval;
		return this.sale = { item, discount, nextSale };
	}
}