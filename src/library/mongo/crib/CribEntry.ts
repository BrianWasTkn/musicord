/**
 * User Entry to manage their bot stuff.
 * @author BrianWasTaken
*/

import { LavaCooldown, LavaSetting } from '../..';
import { Collection } from 'discord.js';
import { UserEntry } from '..';

export class CribEntry extends UserEntry<CribProfile> {
	get cooldowns() {
		return this.data.cooldowns.reduce((col, cd) => col.set(cd.id, new LavaCooldown(this.client, cd)) , new Collection<string, LavaCooldown>());
	}

	get settings() {
		return this.data.settings.reduce((col, s) => col.set(s.id, new LavaSetting(this.client, s)) , new Collection<string, LavaSetting>());
	}

	updateSetting(setting: string, state: boolean, cooldown = 0) {
		const thisSetting = this.data.settings.find(s => s.id === setting);
		thisSetting.cooldown = cooldown;
		thisSetting.enabled = state ?? false;
		return this;
	}

	updateCooldown(command: string, expire: number) {
		const thisCooldown = this.data.cooldowns.find(cd => cd.id === command);
		if (this.client.isOwner(this.data._id) || Boolean(process.env.DEV_MODE)) return this;
		thisCooldown.expire = expire;
		return this;
	}

	updateCommand(command: string) {
		this.data.commands.last_ran = Date.now();
		this.data.commands.last_cmd = command;
		return this;
	}

	punish() {
		return {
			blacklist: (state = true) => {
				this.data.punishments.blocked = state;
				this.data.punishments.count++;
				return this;
			},
			ban: (state = true) => {
				if (this.data.punishments.blocked) return this;
				this.data.punishments.banned = state;
				this.data.punishments.count++;
				return this;
			}
		}
	}

	save(addCommandRan = false, addSpam = false) {
		if (addCommandRan) {
			this.data.commands.commands_ran++;
		}
		if (addSpam) {
			this.data.commands.spams++;
		}

		return super.save();
	}
}