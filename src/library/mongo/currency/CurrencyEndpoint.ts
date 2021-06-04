import { Endpoint, ItemHandler, QuestHandler, CurrencyEntry, Quest } from 'lava/index';

export class CurrencyEndpoint extends Endpoint<CurrencyProfile> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(data => {
			data = data ?? new this.model({ _id });
			const items = this.checkOutdatedItems(data);
			const quests = this.checkOutdatedQuests(data);

			if (items.length >= 1) data.items.push(...items);
			if (quests.length >= 1) data.quests.push(...quests);

			return [items, quests].some(e => e.length > 0) ? data.save() : data;
		}).then(doc => new CurrencyEntry(this.client, doc));
	}

	public checkOutdatedItems(doc: CurrencyProfile) {
		const plugin = this.client.plugins.plugins.get('item');
		const handler = plugin.handler as unknown as ItemHandler;
		return handler.pushSlot(doc);
	}

	public checkOutdatedQuests(doc: CurrencyProfile) {
		const plugin = this.client.plugins.plugins.get('quest');
		const handler = plugin.handler as unknown as QuestHandler;
		return handler.pushSlot(doc);
	}
}