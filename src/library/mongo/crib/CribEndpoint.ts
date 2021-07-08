import { CribEntry, Endpoint } from 'lava/mongo';
import { Donation } from 'lava/akairo';

export class CribEndpoint extends Endpoint<CribProfile> {
	public fetch(_id: string): Promise<CribEntry> {
		return this.model.findOne({ _id }).then(async data => {
			const doc = data ?? await (new this.model({ _id })).save();
			const pushed = [this.updateDonos(doc)];
			return pushed.some(s => s.length > 1) ? doc.save() : doc;
		}).then(doc => new CribEntry(this, doc));
	}

	public updateDonos(doc: CribProfile) {
		const updated: Donation[] = [];
		for (const mod of this.client.handlers.donation.modules.values()) {
			if (!doc.donations.find(i => i.id === mod.id)) {
				doc.donations.push({ id: mod.id, amount: 0, count: 0, donations: [] });
				updated.push(mod);
			}
		}

		return updated;
	}
}