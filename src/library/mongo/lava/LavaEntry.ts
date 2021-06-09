/**
 * User Entry to manage their bot stuff.
 * @author BrianWasTaken
*/

import { Cooldown, UserSetting } from '.';
import { Collection } from 'discord.js';
import { Snowflake } from 'discord.js';
import { UserEntry } from 'lava/mongo';

export class LavaEntry extends UserEntry<LavaProfile> {
	/**
	 * The cooldowns for this entry.
	 */
	get cooldowns() {
		return this.data.cooldowns.reduce((col, cd) => 
			col.set(cd.id, new Cooldown(this.client, cd)),
			new Collection<string, Cooldown>()
		);
	}

	/**
	 * The settings.
	 */
	get settings() {
		return this.data.settings.reduce((col, s) => 
			col.set(s.id, new UserSetting(this.client, s)), 
			new Collection<string, UserSetting>()
		);
	}

	get blocked() {
		return this.data.punishments.blocked;
	}

	get banned() {
		return this.data.punishments.banned;
	}

	updateSetting(setting: string, state: boolean, cooldown = 0) {
		const thisSetting = this.data.settings.find(s => s.id === setting);
		thisSetting.cooldown = cooldown;
		thisSetting.enabled = state;
		return this;
	}

	updateCooldown(command: string, expire: number) {
		const thisCooldown = this.data.cooldowns.find(cd => cd.id === command);
		const user = this.client.users.cache.get(this.data._id as Snowflake);
		if (this.client.isOwner(user) || Boolean(process.env.DEV_MODE)) return this;
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