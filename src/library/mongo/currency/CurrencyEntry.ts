/**
 * User Entry to manage their currency bullshit.
 * @author BrianWasTaken
*/

import { Inventory, Mission, GambleStat, TradeStat } from '.';
import { CollectibleItem, PowerUpItem } from 'lava/../plugins/item';
import { Currency, ItemEffects } from 'lava/utility';
import { Collection, Snowflake } from 'discord.js';
import { UserEntry } from 'lava/mongo';
import { Context } from 'lava/discord';

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

	get shit() {
		return super.map('items', Inventory);
	}

	/**
	 * Their trash inventory.
	*/
	get items() {
		return this.data.items.reduce((coll, slot) => 
			coll.set(slot.id, new Inventory(this.client, slot)), 
			new Collection<string, Inventory>()
		);
	}

	/**
	 * Their quests.
	 */
	get quests() {
		return this.data.quests.reduce((coll, slot) => 
			coll.set(slot.id, new Mission(this.client, slot)), 
			new Collection<string, Mission>()
		);
	}

	/**
	 * Their gambling stats.
	 */
	get gamble() {
		return this.data.gamble.reduce((coll, slot) => 
			coll.set(slot.id, new GambleStat(this.client, slot)), 
			new Collection<string, GambleStat>()
		);
	}

	/**
	 * Their trade stats.
	 */
	get trade() {
		return this.data.trade.reduce((coll, slot) => 
			coll.set(slot.id, new TradeStat(this.client, slot)), 
			new Collection<string, TradeStat>()
		)
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
	public isQuestDone(id: string) {
		return this.quests.get(id).isFinished();
	}

	/**
	 * Calc their multis.
	 */
	public calcMulti(ctx: Context) {
		const unlocked: { name: string, value: number }[] = [];
		const unlock = (name: string, value: number) => {
			return unlocked.push({ name, value });
		}

		// The permanent multis
		unlock('User Multipliers', this.props.multi.base);
		// Level rewards multis
		if (this.props.multi.level_rewards > 0) {
			unlock('Level Rewards', this.props.multi.level_rewards);
		}

		// Memers Crib
		if (ctx.guild.id === '691416705917779999') {
			unlock(ctx.guild.name, 2.5);
		}
		// Nitro Booster
		if (ctx.member.roles.premiumSubscriberRole?.id) {
			unlock('Nitro Booster', 5);
		}
		// Mastery 1 and up
		if (ctx.member.roles.cache.has('794834783582421032')) {
			unlock('Crib Mastery Rank', 1.5);
		}
		// Has 1 of every item
		if (this.items.every(i => i.isOwned())) {
			unlock('Item Collector', 1.5);
		}
		// Item Effects
		if (this.items.some(i => i.multiplier >= 1)) {
			this.items.filter(i => i.isOwned()).forEach(i => {
				if (i.isActive() && i.multiplier >= 1) {
					return unlock(i.module.name, i.multiplier);
				} 
			});
		}
		// Mastery 10
		if (ctx.member.roles.cache.has('794835005679206431')) {
			unlock('Crib Mastery Max', 5);
		}
		// Prestige multis
		if (this.prestige.level >= 1) {
			const multi = Currency.PRESTIGE_MULTI_VALUE * this.prestige.level;
			unlock(`Prestige ${this.prestige.level}`, multi);
		}
		// Collectible Items
		const collectibles = this.items.map(i => i.module).filter(i => i.category.id === 'Collectible') as CollectibleItem[];
		if (collectibles.length >= 1) {
			collectibles.filter(c => c.entities.multipliers).forEach(c => {
				const inv = this.items.get(c.id);
				if (inv.isOwned()) {
					return unlock(c.name, c.entities.multipliers[inv.level] ?? 0);
				}
			});
		}

		return unlocked;
	}

	/**
	 * Chained pocket manager.
	 */
	private pocket(amount: number) {
		return {
			inc: () => {
				this.data.props.pocket += amount;
				return this;
			},
			dec: () => {
				this.data.props.pocket -= amount;
				return this;
			},
			set: () => {
				this.data.props.pocket = amount;
				return this;
			}
		}
	}

	/**
	 * Manage their vault.
	 */
	private vault(amount = 0) {
		return {
			withdraw: (vault = true) => {
				this.data.props.pocket += amount;
				if (vault) this.data.props.vault.amount -= amount;
				return this;
			},
			deposit: (pocket = true) => {
				this.data.props.vault.amount += amount;
				if (pocket) this.data.props.pocket -= amount;
				return this;
			},
			expand: () => {
				this.data.props.space += amount;
				return this;
			},
			lock: () => {
				this.data.props.vault.locked = true;
				return this;
			},
			unlock: () => {
				this.data.props.vault.locked = false;
				return this;
			},
			set: () => {
				this.data.props.vault.amount = amount;
				return this;
			}
		}
	}

	/**
	 * Manage their premium shits.
	 */
	private keys(amount: number) {
		return {
			inc: () => {
				this.data.props.prem += amount;
				return this;
			},
			dec: () => {
				this.data.props.prem -= amount;
				return this;
			},
			set: () => {
				this.data.props.prem = amount;
				return this;
			}
		}
	}

	/**
	 * Manage their inventory.
	*/
	private inventory(id: string) {
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
			},
			upgrade: (level = thisItem.level + 1) => {
				thisItem.level = level;
				return this;
			}
		}
	}

	/**
	 * Manage their xp.
	*/
	private calc() {
		const maxLevel = Currency.MAX_LEVEL * 100;

		return {
			xp: (space = false, additional = 1) => {
				if (this.data.props.xp > maxLevel) return this;
				const { randomNumber } = this.client.util;
				this.data.props.xp += randomNumber(0, 1 + additional);
				return space ? this.calc().space() : this;
			},
			space: (os = 55) => {
				if (this.data.props.xp > maxLevel) return this;
				const { level } = this.data.prestige;
				const amount = Math.ceil(os * (level / 2) + os);
				return this.vault(amount).expand();
			}
		}
	}

	/**
	 * Manage their dailytards.
	*/
	private daily() {
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
	private stats(game: string) {
		const thisStat = this.data.gamble.find(stat => stat.id === game);

		return {
			coins: (amount: number) => ({
				add: () => {
					thisStat.won += amount;
					return this;
				},
				sub: () => {
					thisStat.lost += amount;
					return this;
				}
			}),
			games: (amt = 1) => ({
				loses: () => {
					thisStat.loses += amt;
					return this;
				},
				wins: () => {
					thisStat.wins += amt;
					return this;
				}
			})
		}
	}

	/** Add coins to ur pocket */
	addPocket(amount: number) {
		return this.pocket(amount).inc();
	}

	/** Remove coins from pocket */
	removePocket(amount: number) {
		return this.pocket(amount).dec();
	}

	/** Add certain amount of keys */
	addKeys(amount: number) {
		return this.keys(amount).inc();
	}

	/** Remove amount of keys */
	remKeys(amount: number) {
		return this.keys(amount).dec();
	}

	/** Withdraw coins from ur vault */
	withdraw(amount: number, removeVault = true) {
		return this.vault(amount).withdraw(removeVault);
	}

	/** Deposit coins into your vault */
	deposit(amount: number, removePocket = true) {
		return this.vault(amount).deposit(removePocket);
	}

	/** Expand ur vault */
	expandVault(amount: number) {
		return this.vault(amount).expand();
	}

	/** Lock your vault */
	lockVault() {
		return this.vault().lock();
	}

	/** Unlock ur vault */
	unlockVault() {
		return this.vault().unlock();
	}

	/** Update a game stat */
	updateStats(game: string, coins: number, isWin: boolean) {
		const coin = this.stats(game).coins(coins);
		const games = this.stats(game).games();
		
		if (isWin) {
			games.wins();
			coin.add();
			return this;
		}

		games.loses();
		coin.sub();
		return this;
	}

	/** Update their item effects */
	updateEffects() {
		const { effects, modules } = this.client.handlers.item;
		const userID = this.data._id as Snowflake;
		const itemMap = new Collection<string, ItemEffects>();
		this.items.filter(i => i.isActive()).forEach(i => {
			const instance = this.client.util.effects();
			return itemMap.set(i.module.id, instance);
		});

		const userEffects = effects.set(userID, itemMap).get(userID);
		if (userEffects.size < 1) return this;

		for (const item of modules.array() as PowerUpItem[]) {
			if (item.category.id === 'Power-Up') {
				const inv = this.items.get(item.id);
				const eff = userEffects.get(inv.id);
				item.effect(eff, this);
			}
		}

		return this;
	}

	/** Increment the amount of stuff they own to an item */
	addItem(id: string, amount = 1) {
		return this.inventory(id).increment(amount);
	}

	/** Opposite of the thing above */
	subItem(id: string, amount = 1) {
		return this.inventory(id).decrement(amount);
	}

	/** Activate an item based on it's expiration date */
	activateItem(id: string, expiration: number) {
		return this.inventory(id).activate(expiration);
	}

	/** Deactivate an item */
	deactivateItem(id: string) {
		return this.inventory(id).deactivate();
	}

	/** Set the multi of an item */
	setItemMulti(id: string, multi: number) {
		return this.inventory(id).setMulti(multi);
	}

	/** Upgrade an item */
	upgradeItem(id: string) {
		return this.inventory(id).upgrade();
	}

	/**
	 * The final shitfuckery this entry needs to do after tolerating bot spammers.
	*/
	save(runPost = true) {
		if (runPost) {
			this.calc().xp(true);
			this.updateEffects();
		}

		return super.save();
	}
}