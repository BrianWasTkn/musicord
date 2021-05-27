import { CurrencyEntry } from '.';
import { Endpoint } from '..';

export class CurrencyEndpoint extends Endpoint<CurrencyProfile> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(data => {
			const { missing, doc } = this.updateItems(data ?? new this.model({ _id }));
			return missing >= 1 ? doc.save() : doc;
		}).then(doc => new CurrencyEntry(this.client, doc));
	}

	public updateItems(doc: CurrencyProfile): { doc: CurrencyProfile, missing: number } {
		const { modules } = this.client.itemHandler;

		let missing = 0;
		if (modules.size >= 1) {
			for (const item of modules.values()) {
				if (!doc.items.find(i => i.id === item.id)) {
					doc.items.push({ id: item.id, ...this.defaultInventory });
					missing++
				}
			}
		}

		return { doc, missing };
	}

	public get defaultInventory(): Omit<CurrencyInventory, 'id'> {
		return {
			amount: 0,
			expire: 0,
			level: 0,
			multi: 0,
			uses: 0,
		};
	}
}