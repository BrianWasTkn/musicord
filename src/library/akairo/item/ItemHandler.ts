import { AbstractHandlerOptions, AbstractHandler, LavaClient, CurrencyEntry, Item } from 'lava/index';

export interface ItemSale {
	/**
	 * The discount from 1% to 65%
	 */
	discount: number;
	/**
	 * The stamp when the next sale would be.
	 */
	nextSale: number;
	/**
	 * The item on sale.
	 */
	item: Item;
}

export class ItemHandler extends AbstractHandler<Item> {
	/**
	 * The sale item.
	 */
	public sale: ItemSale;

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
			this.client.setInterval(this.setSaleItem, 60000);
		});
	}

	private setSaleItem(): ItemSale {
		const { randomInArray, randomNumber } = this.client.util;
		const items = [...this.modules.values()].filter(i => !i.config.premium);
		const item = randomInArray(items), discount = randomNumber(1, 100);

		let nextSale: number;
		if (!this.sale.nextSale) nextSale = Date.now();
		nextSale = nextSale += 60000;
		return this.sale = { item, discount, nextSale };
	}

	/**
	 * Update user's inventory.
	 */
	public pushSlot(data: CurrencyProfile) {
		let slots: CurrencyInventory[] = [];
		for (const item of this.modules.values()) {
			if (!data.items.find(i => i.id === item.id)) {
				slots.push({
					id: item.id,
					amount: 0,
					expire: 0,
					level: 0,
					multi: 0,
					uses: 0
				});
			}
		}

		return slots;
	}
}