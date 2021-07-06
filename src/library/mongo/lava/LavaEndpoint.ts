import { Command, Setting } from 'lava/akairo';
import { LavaEntry } from '.';
import { Endpoint } from 'lava/mongo';

export class LavaEndpoint extends Endpoint<LavaProfile> {
	public fetch(_id: string): Promise<LavaEntry> {
		return this.model.findOne({ _id }).then(async data => {
			const doc = data ?? await (new this.model({ _id })).save();
			const pushed = [this.updateCooldowns(doc), this.updateSettings(doc)];
			return pushed.some(s => s.length > 1) ? doc.save() : doc;
		}).then(doc => new LavaEntry(this, doc));
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