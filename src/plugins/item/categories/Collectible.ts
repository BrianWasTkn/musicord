import { Context, Item, ItemOptions, CurrencyEntry } from 'lava/index';
import { MessageOptions } from 'discord.js';

export interface CollectibleItemOptions extends Pick<ItemOptions, 'name' | 'price' | 'emoji' | 'shortInfo' | 'longInfo' | 'upgrades'> {
	/**
	 * The entities aka "perks" of this collectible.
	 */
	entities?: Entity;
}

/**
 * The perks aka "entities" for this collectible.
 */
export interface Entity {
	/**
	 * The additional dice roll on gambling.
	 */
	dice?: number[];
	/**
	 * The discount debuffed if they buy an item.
	 */
	discount?: number[];
	/**
	 * The possible rewarded multis if they own one of this.
	 */
	multipliers?: number[];
	/**
	 * The possible steal shields if they own this collectible.
	 */
	shield?: number[];
	/**
	 * The possible slot odd to hit a jackpot.
	 */
	slots?: number[];
	/**
	 * The rate between 1-500% of payouts on commands that gives you coins.
	 */
	payouts?: number[];
	/**
	 * The possible xp boost between 50-1000% 
	 */
	xpBoost?: number[];
	/**
	 * Increase odds of successful rob.
	 */
	rob?: number[];
}

export abstract class CollectibleItem extends Item {
	/**
	 * Possible perks if they own this collectible.
	 */
	public entities: Entity;

	/**
	 * Constructor for this goldshit.
	 */
	public constructor(id: string, options: CollectibleItemOptions) {
		super(id, {
			name: options.name,
			emoji: options.emoji,
			price: options.price,
			shortInfo: options.shortInfo,
			longInfo: options.longInfo,
			upgrades: options.upgrades,
			sale: true,
			inventory: true,
			shop: true,
			buyable: true,
			giftable: true,
			sellable: false,
			usable: true,
			push: true,
			premium: false,
			retired: false,
			category: 'Collectible'
		});

		this.entities = options.entities;
	}

	/**
	 * Method to use this collectible.
	 */
	public use(ctx: Context, entry: CurrencyEntry): MessageOptions {
		const thisItem = entry.items.get(this.id);
		return { reply: { messageReference: ctx.id }, content: `**${this.emoji} WHAT A FLEX!**\nImagine having **${thisItem.owned.toLocaleString()}**, couldn't be me` };
	}
}