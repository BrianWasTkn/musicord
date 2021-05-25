/**
 * User Entry to manage their currency bullshit.
 * @author BrianWasTaken
*/

import { Currency, Command, Inventory, Cooldown } from '../..';
import { Collection } from 'discord.js';
import { UserEntry } from '..';

export class CurrencyEntry extends UserEntry<CurrencyData> {
	/**
	 * Basic properties for their datatards.
	*/
	get props() {
		return this.data.props;
	}

	/**
	 * Their prestige info.
	*/
	get prestige() {
		return this.data.prestige;
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
		return this.data.items.reduce((coll, slot) => coll.set(slot.id, new Inventory(this.client, slot)), new Collection<string, Inventory>());
	}

	/**
	 * Their cooldowns.
	*/
	get cooldowns() {
		return this.data.cooldowns.reduce((coll, cd) => coll.set(cd.id, new Cooldown(this.client, cd)), new Collection<string, Cooldown>());
	}

	/**
	 * Check if they have at least one of this item on their inventory.
	*/
	public hasInventoryItem(id: string) {
		return this.items.get(id).isOwned();
	}

	/**
	 * Find an item from their inventory.
	*/
	public findInventoryItem(id: string) {
		return this.items.get(id);
	}

	/**
	 * Add a cooldown.
	*/
	addCooldown(id: string, time = 1000) {
		if (this.client.isOwner(this.data._id)) return this;
		const expire = Date.now() + time;
		const cd = this.cooldowns.get(id);

		if (!cd) {
			this.data.cooldowns.push({ expire, id });
			return this;
		}

		this.data.cooldowns.find(c => c.id === cd.id).expire = expire;
		return this;
	}

	/**
	 * Sweep all cooldowns.
	*/
	sweepCooldowns() {
		this.data.cooldowns.map(cd => cd.expire = 0);
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
				this.data.props.vault.amount -= amount;
				this.data.props.pocket += amount;
				return this;
			},
			deposit: () => {
				this.data.props.vault.amount += amount;
				this.data.props.pocket -= amount;
				return this;
			},
			expand: () => {
				this.data.props.vault.amount += amount;
				return this;
			},
		}
	}

	/**
	 * Manage their inventory.
	*/
	inventory(id: string) {
		const thisItem = this.data.items.find(i => i.id === id);

		return {
			increment: (amount = 1) => {
				thisItem.amount += amount;
				return this;
			},
			decrement: (amount = 1) => {
				thisItem.amount -= amount;
				return this;
			},
			activate: (expire: number) => {
				thisItem.expire = expire;
				return this;
			},
			deactivate: () => {
				thisItem.expire = 0;
				return this;
			},
			setMulti: (multi: number) => {
				thisItem.multi = multi;
				return this;
			}
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
				this.data.props.xp += randomNumber(1, 2);
				if (space) this.calc().space();
				return this;
			},
			space: (os = 55) => {
				const { level } = this.data.prestige;
				const amount = Math.ceil(os * (level / 2) + os);
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
				this.data.daily.streak++;
				return this;
			},
			resetStreak: () => {
				this.data.daily.streak = 1;
				return this;
			},
			recordStreak: (stamp = Date.now()) => {
				this.data.daily.time = stamp;
				return this;
			}
		}
	}

	/**
	 * Manage their gambling statfuckeries.
	*/
	stats(game: string) {
		const thisStat = this.data.gamble_stats.find(stat => stat.id === game);
		return {
			coins: (amount: number) => ({
				lost: () => {
					thisStat.won += amount;
					return this;
				},
				won: () => {
					thisStat.lost += amount;
					return this;
				}
			}),
			games: (inc = 1) => ({
				loses: () => {
					thisStat.loses += inc;
					return this;
				},
				wins: (inc = 1) => {
					thisStat.wins += inc;
					return this;
				}
			})
		}
	}

	/**
	 * The final shitfuckery this entry needs to do after tolerating bot spammers.
	*/
	save(runPostFunctions = true) {
		if (runPostFunctions) {
			this.data.props.xp = Math.min(this.data.props.xp, Currency.MAX_LEVEL * 100);
			this.data.props.space = Math.min(this.data.props.space, Currency.MAX_SAFE_SPACE);
		}

		return super.save();
	}
}