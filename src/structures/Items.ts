import { LavaClient } from './Client'
import { Message } from 'discord.js'

interface Item {
	name: string;
	price: number;
	buyable: boolean;
	usable: boolean;
	sellable: boolean;
	description: string;
	sell_price: number;
	consume: (_: Message) => any;
}

class Items {
	public client: LavaClient;
	public items: Array<Item>;
	constructor(client: LavaClient) {
		this.client = client;
		this.items = [];
	}

	find(query) {
		const item = this.items.find(i => i.name.includes(query));
		if (!item) return false;
		return item;
	}
}

export default Items;