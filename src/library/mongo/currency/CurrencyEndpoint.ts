import { Endpoint, ItemHandler, Item, CurrencyEntry } from 'lava/index';

export class CurrencyEndpoint extends Endpoint<CurrencyProfile> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(async data => {
			const doc = data ?? await (new this.model({ _id })).save();
			const items = this.updateItems(doc);

			return [items].some(s => s.length > 1) ? doc.save() : doc;
		}).then(doc => new CurrencyEntry(this.client, doc));
	}

	/**
	 * Update user inventory.
	 */
	public updateItems(doc: CurrencyProfile) {
		const { handler } = this.client.plugins.plugins.get('item');
		const updated: Item[] = [];
		for (const mod of (handler as unknown as ItemHandler).modules.values()) {
			if (!doc.items.find(i => i.id === mod.id)) {
				doc.items.push({ id: mod.id, amount: 0, uses: 0, expire: 0, level: 0, multi: 0 });
				updated.push(mod);
			}
		}

		return updated;
	}
}