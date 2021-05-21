import { AbstractHandlerOptions, AbstractHandler, LavaClient } from '..';
import { Item } from '.';

export interface ItemSale {
	discount: number;
	nextSale: number;
	item: Item;
}

export class ItemHandler extends AbstractHandler<Item> {
	public sale: ItemSale;
	public constructor(client: LavaClient, options: AbstractHandlerOptions) {
		super(client, options);

		/**
		 * Sale Item.
		*/
		this.client.once('ready', () => {
			if (!this.modules.size) return;
			const setSale = () => this.sale = this.getSaleItem();
			return this.client.setInterval(setSale, 60000);
		});
	}

	private getSaleItem(): ItemSale {
		const { randomInArray, randomNumber } = this.client.util;
		const items = [...this.modules.values()].filter(i => !i.config.premium);
		const item = randomInArray(items), discount = randomNumber(1, 100);

		let nextSale: number;
		if (!this.sale.nextSale) nextSale = Date.now();
		nextSale = nextSale += 60000;
		return { item, discount, nextSale };
	}
}