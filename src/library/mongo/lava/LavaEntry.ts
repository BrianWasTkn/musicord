/**
 * User Entry to manage their bot stuff.
 * @author BrianWasTaken
*/

import { Cooldown, UserSetting } from '.';
import { Collection } from 'discord.js';
import { Snowflake } from 'discord.js';
import { UserEntry } from 'lava/mongo';

export class LavaEntry extends UserEntry<LavaProfile> {
	/** Wether they are blacklisted from the bot or not */
	get blocked() {
		return this.data.punishments.blocked;
	}

	/** Check if they're banned from the bot */
	get banned() {
		return this.data.punishments.banned;
	}

	/** User cooldowns mapped from command id to cooldown */
	get cooldowns() {
		return this.data.cooldowns.reduce((col, cd) => 
			col.set(cd.id, new Cooldown(this.client, cd)),
			new Collection<string, Cooldown>()
		);
	}

	/** User settings mapped from setting id to setting */
	get settings() {
		return this.data.settings.reduce((col, s) => 
			col.set(s.id, new UserSetting(this.client, s)), 
			new Collection<string, UserSetting>()
		);
	}

	/** Bot bans and blacklist methods */
	private punish(duration?: number) {
		return {
			blacklist: (state = true) => {
				if (this.data.punishments.banned) return this;
				this.data.punishments.blocked = state;
				this.data.punishments.expire = duration;
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

	/** Command usage */
	private command(id = 'help') {
		return {
			spam: (amt = 1) => {
				this.data.commands.spams += amt;
				return this;
			},
			inc: (amount = 1) => {
				this.data.commands.commands_ran += amount;
				return this;
			},
			record: () => {
				this.data.commands.last_ran = Date.now();
				this.data.commands.last_cmd = id;
				return this;
			}
		}
	}

	/** Update user settings */
	updateSetting(setting: string, state: boolean, cooldown = 0) {
		const thisSetting = this.data.settings.find(s => s.id === setting);
		thisSetting.cooldown = cooldown;
		thisSetting.enabled = state;
		return this;
	}

	/** Update user command cooldowns */
	updateCooldown(command: string, expire: number) {
		const thisCooldown = this.data.cooldowns.find(cd => cd.id === command);
		const user = this.client.users.cache.get(this.data._id as Snowflake);
		if (this.client.isOwner(user) || Boolean(process.env.DEV_MODE)) return this;
		thisCooldown.expire = expire;
		return this;
	}

	/** Add spam count for spamfucks */
	addSpam() {
		return this.command().spam();
	}

	/** Add command usage */
	addUsage(id: string) {
		const thisCommand = this.command(id);
		thisCommand.inc();
		return thisCommand.record();
	}

	/** Blacklist them temporarily */
	blacklist(duration: number) {
		return this.punish(duration).blacklist();
	}

	/** Ban them from this bot */
	ban() {
		return this.punish().ban();
	}

	/** Save dis shit */
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