import { LavaEntry, Endpoint, Setting } from 'lava/index';

export class LavaEndpoint extends Endpoint<LavaProfile> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(async data => {
			const doc = data ?? await (new this.model({ _id })).save();
			const settings = this.updateSettings(doc);

			return [settings].some(s => s.length > 1) ? doc.save() : doc;
		}).then(doc => new LavaEntry(this.client, doc));
	}

	public updateSettings(doc: LavaProfile) {
		const updated: Setting[] = [];
		for (const mod of this.client.handlers.setting.modules.values()) {
			if (!doc.settings.find(i => i.id === mod.id)) {
				doc.settings.push({ id: mod.id, amount: 0, uses: 0, expire: 0, level: 0, multi: 0 });
				updated.push(mod);
			}
		}

		return updated;
	}
}