/**
 * User Entry to manage their currency bullshit.
 * @author BrianWasTaken
*/

import { UserEntry, Currency, Inventory, Mission } from 'src/library';
import { Collection } from 'discord.js';

export class CurrencyEntry extends UserEntry<CurrencyProfile> {
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
	 * Their trash inventory.
	*/
	get items() {
		return this.data.items.reduce((coll, slot) => 
			coll.set(slot.id, new Inventory({
				client: this.client,
				id: slot.id
			}, slot)), 
			new Collection<string, Inventory>()
		);
	}

	/**
	 * Their quests.
	 */
	get quests() {
		return this.data.quests.reduce((coll, slot) => 
			coll.set(slot.id, new Mission({
				client: this.client,
				id: slot.id
			}, slot)), 
			new Collection<string, Mission>()
		);
	}

	/**
	 * Check if they have at least one of this item on their inventory.
	*/
	public hasInventoryItem(id: string) {
		return this.items.get(id).isOwned();
	}

	/**
	 * Check if a quest is has been completed.
	 */
	public isQuestFinished(id: string) {
		return this.quests.get(id).isFinished();
	}

	/**
	 * Add a cooldown.
	*/
	// addCooldown(id: string, time = 1000) {
	// 	if (this.client.isOwner(this.data._id)) return this;
	// 	const expire = Date.now() + time;
	// 	const cd = this.cooldowns.get(id);

	// 	if (!cd) {
	// 		this.data.cooldowns.push({ expire, id });
	// 		return this;
	// 	}

	// 	this.data.cooldowns.find(c => c.id === cd.id).expire = expire;
	// 	return this;
	// }

	/**
	 * Sweep all cooldowns.
	*/
	// sweepCooldowns() {
	// 	this.data.cooldowns.map(cd => cd.expire = 0);
	// 	return this;
	// }

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
				return space ? this.calc().space() : this;
			},
			space: (os = 55) => {
				const { level } = this.data.prestige;
				const amount = Math.ceil(os * (level / 2) + os);
				return this.vault(amount).expand();
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
		const thisStat = this.data.gamble.find(stat => stat.id === game);
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
				wins: () => {
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