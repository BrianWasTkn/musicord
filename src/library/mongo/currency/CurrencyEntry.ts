/// <reference path="../../../typings/mongo.currency.d.ts" />

/**
 * User Entry
*/

import { Currency, Command, Inventory } from '../..';
import { Collection } from 'discord.js';
import { UserEntry } from '..';

export class CurrencyEntry extends UserEntry<CurrencyData> {
	/**
	 * Basic properties for their stupid data.
	*/
	get props() {
		return this.data.props;
	}

	/**
	 * Their setfuckeries.
	*/
	get settings() {
		return this.data.settings;
	}

	/**
	 * Their trash inventory.
	*/
	get items() {
		return this.data.props.items.reduce((coll, slot) => coll.set(slot.id, new Inventory(this.client, slot)), new Collection<string, Inventory>());
	}

	/**
	 * Their cooldowns.
	*/
	get cooldowns() {
		return this.data.props.cooldowns;
	}

	/**
	 * Find a specific cooldown based from the id given.
	 * @private
	*/
	private findCooldown(id: string) {
		return this.data.props.cooldowns.find(i => i.id === id);
	}

	/**
	 * Check if an item exists on their inventory.
	*/
	public hasInventoryItem(id: string) {
		return this.items.get(id).isOwned();
	}

	/**
	 * Add a cooldown to them.
	*/
	addCooldown(id: string, time = 1000) {
		if (this.client.isOwner(this.data._id)) return this;
		const expire = Date.now() + time;
		const cd = this.findCooldown(id);

		if (!cd) {
			this.data.props.cooldowns.push({ expire, id });
			return this;
		}

		cd.expire = expire;
		return this;
	}

	/**
	 * Sweep all cooldowns.
	*/
	sweepCooldowns() {
		this.data.props.cooldowns.map(cd => cd.expire = 0);
		return this;
	}

	/**
	 * Manage their premium keytards.
	*/
	keys(amount: number) {
		return {
			add: () => {
				this.data.props.prem += amount;
				return this;
			},
			remove: () => {
				this.data.props.prem -= amount;
				return this;
			},
			set: () => {
				this.data.props.prem = amount;
				return this;
			},
		}
	}

	/**
	 * Manage their pocket.
	*/
	pocket(amount: number) {
		return {
			add: () => {
				this.data.props.pocket += amount;
				return this;
			},
			remove: () => {
				this.data.props.pocket -= amount;
				return this;
			},
			set: () => {
				this.data.props.pocket = amount;
				return this;
			},
		};
	}

	/**
	 * Manage their vault.
	*/
	vault(amount: number) {
		return {
			withdraw: () => {
				this.data.props.vault -= amount;
				this.data.props.pocket += amount;
				return this;
			},
			deposit: () => {
				this.data.props.vault += amount;
				this.data.props.pocket -= amount;
				return this;
			},
			expand: () => {
				this.data.props.vault += amount;
				return this;
			},
		}
	}

	/**
	 * Manage their xp.
	*/
	calc() {
		return {
			xp: (space = false) => {
				const { randomNumber } = this.client.util;
				// @TODO: modify "2" to be dependent on cheese for example.
				this.data.upgrades.xp += randomNumber(1, 2);
				if (space) this.calc().space();
				return this;
			},
			space: (os = 55) => {
				const { prestige } = this.data.upgrades;
				const amount = Math.ceil(os * (prestige / 2) + os);
				this.vault(amount).expand();
				return this;
			}
		}
	}

	/**
	 * Manage their dailytards.
	*/
	daily() {
		return {
			addStreak: () => {
				this.data.misc.daily.streak++;
				return this;
			},
			resetStreak: () => {
				this.data.misc.daily.streak = 1;
				return this;
			},
			recordStreak: (stamp = Date.now()) => {
				this.data.misc.daily.time = stamp;
				return this;
			}
		}
	}

	/**
	 * Manage their gambling statfuckeries.
	*/
	stats(game: string, winsOrLoses: 'wins' | 'loses', wonOrLost: number) {
		return {
			update: () => {
				const thisStat = this.data.stats.find(stat => stat.id === game);
				thisStat[winsOrLoses === 'wins' ? 'won' : 'lost'] += wonOrLost;
				thisStat[winsOrLoses]++;
				return this;
			}
		}
	}

	/**
	 * The final shitfuckery this entry needs to do after babysitting.
	*/
	save() {
		this.data.upgrades.xp = Math.min(this.data.upgrades.xp, Currency.MAX_LEVEL * 100);
		return super.save();
	}
}