/**
 * User Entry to manage their currency bullshit.
 * @author BrianWasTaken
*/

import { Inventory, Mission, GambleStat, TradeStat } from '.';
import { Collection, Snowflake, TextChannel } from 'discord.js';
import { CollectibleItem, PowerUpItem } from 'lava/../plugins/item';
import { Currency, ItemEffects } from 'lava/utility';
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

	/**
	 * Their trash inventory.
	*/
	get items() {
		return super.map('items', Inventory);
	}

	/**
	 * Their quests.
	 */
	get quests() {
		return super.map('quests', Mission);
	}

	/**
	 * Their gambling stats.
	 */
	get gamble() {
		return super.map('gamble', GambleStat);
	}

	/**
	 * Their trade stats.
	 */
	get trade() {
		return super.map('trade', TradeStat);
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
		const all: { name: string, value: number }[] = [];
		const unlock = (name: string, value: number, truthy: boolean) => {
			const fml = { name, value };
			if (truthy) unlocked.push(fml);
			return all.push(fml);
		}

		// The permanent multis
		unlock('User Multipliers', this.props.multi.base, true);
		// Level rewards multis
		unlock('Level Rewards', this.props.multi.level_rewards, this.props.multi.level_rewards > 0);
		// Memers Crib
		unlock(ctx.guild.name, 10, ctx.guild.id === '691416705917779999');
		// Nitro Booster
		unlock('Nitro Booster', 5, !!ctx.member.roles.premiumSubscriberRole?.id);
		// Mastery 1 and up
		unlock('Crib Mastery Rank', 3, ctx.member.roles.cache.has('794834783582421032'));
		// Has 1 of every item
		unlock('Item Collector', 2, this.items.every(i => i.isOwned()));

		// Item Effects
		this.items.filter(i => i.isOwned() && i.multiplier > 0).forEach(i => {
			return unlock(i.module.name, i.multiplier, i.isActive() && i.multiplier >= 1);
		});

		// Mastery 10
		unlock('Crib Mastery Max', 2, ctx.member.roles.cache.has('794835005679206431'));
		// Prestige multis
		const prestigeMulti = Currency.PRESTIGE_MULTI_VALUE * this.prestige.level;
		unlock(`Prestige ${this.prestige.level}`, prestigeMulti, this.prestige.level >= 1);
		
		// Collectible Items
		const collectibles = this.items.map(i => i.module).filter(i => i.category.id === 'Collectible') as CollectibleItem[];
		if (collectibles.length >= 1) {
			collectibles.filter(c => c.entities.multipliers).forEach(c => {
				const inv = this.items.get(c.id);
				return unlock(c.name, c.entities.multipliers[inv.level] ?? 0, inv.isOwned());
			});
		}

		// Memers Crib Staff
		unlock('Crib Staff', 2, ctx.member.roles.cache.has('692941106475958363'));
		// Chips Cult
		unlock('Chips Cult', 6, ctx.member.nickname?.toLowerCase().includes('chips'));
		// Lava Channel
		unlock('Lava Channel', 25, (ctx.channel as TextChannel).name.toLowerCase().includes('lava'));

		return { unlocked, all };
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
			xp: (space = false, additional = 0) => {
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
	addPocket(amount: number, isShare = false) {
		// if (isShare) 
		return this.pocket(amount).inc();
	}

	/** Remove coins from pocket */
	removePocket(amount: number, isShare = false) {
		// if (isShare) 
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

	/** Record ur daily */
	recordDailyStreak() {
		return this.daily().recordStreak();
	}

	/** Add ur daily streak */
	addDailyStreak() {
		return this.daily().addStreak();
	}

	/** reset idk im tired writing this */
	resetDailyStreak() {
		return this.daily().resetStreak();
	}

	/** Update a gambling game stat */
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

	/** Kill them */
	kill() {
		const { randomNumber } = this.client.util;
		const { pocket } = this.data.props;

		const item = this.items.filter(i => i.isOwned()).random() ?? null;
		const amount = item ? randomNumber(1, item.owned) : 0;
		if (item) this.inventory(item.module.id).decrement(amount);

		return this.pocket(pocket > 0 ? randomNumber(1, pocket) : 0).dec();
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