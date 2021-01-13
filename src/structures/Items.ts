import { LavaClient } from './Client'

class Items {
	public client: LavaClient;
	public items: Array<any>;
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