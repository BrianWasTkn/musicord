import { CribEntry } from '.';
import { Endpoint } from '..';

export class CribEndpoint extends Endpoint<CribProfile> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(data => {
			const { missing, doc } = this.pushDonos(data ?? new this.model({ _id }));
			return missing >= 1 ? doc.save() : doc;
		}).then(doc => new CribEntry(this.client, doc));
	}

	public pushDonos(doc: CribProfile) {
		const { modules } = this.client.donationHandler;

		let missing = 0;
		if (modules.size < 1) return { doc, missing };
		for (const dono of modules.values()) {
			if (!doc.donations.find(i => i.id === dono.id)) {
				doc.donations.push({ id: dono, amount: 0 });
				missing++;
			}
		}

		return { doc, missing };
	}
}