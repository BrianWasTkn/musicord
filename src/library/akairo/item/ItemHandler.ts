import { AbstractHandlerOptions, AbstractHandler, LavaClient, Item } from 'lava/akairo';

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
	 * Construct an item handler.
	 */
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);

		/**
		 * Sale Item.
		*/
		this.client.once('ready', () => {
			if (!this.modules.size) return;
			this.setSaleItem();
			this.client.setInterval(this.setSaleItem.bind(this), 1e3 * 5 * 60);
		});
	}

	/**
	 * Sets the sale item.
	 */
	private setSaleItem(): ItemSale {
		const { randomInArray, randomNumber } = this.client.util;
		const items = [...this.modules.values()].filter(i => !i.config.premium);
		const item = randomInArray(items), discount = randomNumber(1, 100);
		const nextSale = (!this.sale.nextSale ? Date.now() : this.sale.nextSale) + (1e3 * 5 * 60);
		return this.sale = { item, discount, nextSale };
	}
}