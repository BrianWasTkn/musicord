import { Context, Item, ItemOptions, ItemAssets, ItemConfig, CurrencyEntry } from 'lava/index';
import { MessageOptions } from 'discord.js';

export type CollectibleItemAssets = Omit<ItemAssets, 'sellRate'>;

export type CollectibleItemConfig = Pick<ItemConfig, 'push' | 'retired'>;

export interface CollectibleItemOptions extends Omit<ItemOptions, 'assets' | 'config'> {
	/** The basic info about this collectible. */ 
	assets: CollectibleItemAssets;
	/** The config for this collectible. */
	config?: CollectibleItemConfig;
	/** The perks of this collectible. */
	entities?: CollectibleEntity;
}

export interface CollectibleEntity {
	/** The additional dice roll on gambling. */
	dice?: number[];
	/** The discount debuffed if they buy an item. */
	discount?: number[];
	/** The possible rewarded multis if they own one of this. */
	multipliers?: number[];
	/** The possible steal shields if they own this collectible. */
	shield?: number[];
	/** The possible slot odd to hit a jackpot. */
	slots?: number[];
	/** The rate between 1-500% of payouts on commands that gives you coins. */
	payouts?: number[];
	/** The possible xp boost between 50-1000% */
	xpBoost?: number[];
	/** Increase odds of successful rob.*/
	rob?: number[];
}

export abstract class CollectibleItem extends Item {
	/** Possible perks if they own this collectible. */
	public entities: CollectibleEntity;

	/**
	 * Constructor for this goldshit.
	 */
	public constructor(id: string, options: CollectibleItemOptions) {
		const { assets, config, upgrades, entities } = options;
		super(id, {
			assets: {
				sellRate: 0.33,
				category: 'Collectible',
				...assets
			},
			config: {
				premium: false,
				buyable: true,
				sellable: false,
				usable: true,
				giftable: true,
				shop: true,
				sale: true,
				inventory: true,
				...config
			},
			upgrades: options.upgrades?.map(up => ({ 
				sellRate: 0.33, 
				...up 
			})) ?? [],
		});

		this.entities = options.entities ?? Object.create(null);
	}

	/**
	 * Method to use this collectible.
	 */
	public use(ctx: Context, entry: CurrencyEntry): MessageOptions {
		const thisItem = entry.items.get(this.id);
		return { reply: { messageReference: ctx.id }, content: `**${this.emoji} WHAT A FLEX!**\nImagine having **${thisItem.owned.toLocaleString()}**, couldn't be me` };
	}
}