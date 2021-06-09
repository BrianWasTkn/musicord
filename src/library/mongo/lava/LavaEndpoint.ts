import { LavaEntry, Endpoint, Setting, Command } from 'lava/index';

export class LavaEndpoint extends Endpoint<LavaProfile> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(async data => {
			const doc = data ?? await (new this.model({ _id })).save();
			const cooldowns = this.updateCooldowns(doc);
			const settings = this.updateSettings(doc);

			return [settings, cooldowns].some(s => s.length > 1) ? doc.save() : doc;
		}).then(doc => new LavaEntry(this.client, doc));
	}

	public updateSettings(doc: LavaProfile) {
		const updated: Setting[] = [];
		for (const mod of this.client.handlers.setting.modules.values()) {
			if (!doc.settings.find(i => i.id === mod.id)) {
				doc.settings.push({ id: mod.id, cooldown: 0, enabled: mod.default });
				updated.push(mod);
			}
		}

		return updated;
	}

	public updateCooldowns(doc: LavaProfile) {
		const updated: Command[] = [];
		for (const mod of this.client.handlers.command.modules.values()) {
			if (!doc.cooldowns.find(i => i.id === mod.id)) {
				doc.cooldowns.push({ id: mod.id, expire: 0 });
				updated.push(mod);
			}
		}

		return updated;
	}
}