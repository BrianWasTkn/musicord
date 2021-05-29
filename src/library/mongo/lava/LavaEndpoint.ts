import { LavaEntry } from '.';
import { Endpoint } from '..';

export class LavaEndpoint extends Endpoint<LavaProfile> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(data => {
			const { missing, doc } = this.pushSettings(data ?? new this.model({ _id }));
			return missing >= 1 ? doc.save() : doc;
		}).then(doc => new LavaEntry(this.client, doc));
	}

	public pushSettings(doc: LavaProfile) {
		const { modules } = this.client.settingHandler;

		let missing = 0;
		if (modules.size < 1) return { doc, missing };
		for (const setting of modules.values()) {
			if (!doc.settings.find(i => i.id === setting.id)) {
				// @TODO: add default value for setting module. 
				const { defaultState: enabled } = setting.config;
				doc.settings.push({ id: setting.id, enabled, cooldown: 0 });
				missing++;
			}
		}

		return { doc, missing };
	}
}