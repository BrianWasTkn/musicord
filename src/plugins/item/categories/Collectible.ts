import { Context, Item, ItemOptions, ItemAssets, ItemUpgrade, ItemConfig, CurrencyEntry } from 'lava/index';
import { MessageOptions } from 'discord.js';

export type CollectibleItemAssets = Omit<ItemAssets, 'sellRate' | 'upgrade'>;

export type CollectibleItemConfig = Omit<ItemConfig, 'premium' | 'sellable'>;

export interface CollectibleItemOptions extends Omit<ItemOptions, 'assets' | 'config' | 'upgrades'> {
	/** The basic info about this collectible. */ 
	assets: CollectibleItemAssets;
	/** The config for this collectible. */
	config: CollectibleItemConfig;
	/** The perks of this collectible. */
	entities: Partial<CollectibleEntity>;
	/** The upgrades of this goldshit. */
	upgrades: Partial<ItemUpgrade>[];
}

export interface CollectibleEntity {
	/** The discount whenever they buy an item. */
	discount: number[];
	/** The possible rewarded multis if they own one of this. */
	multipliers: number[];
	/** The possible steal shields they'll get if they own this collectible. */
	shield: number[];
	/** The rate between 1-100% for more payouts on multiplier-based gambling commands. */
	payouts: number[];
	/** The possible xp boost between 10-100% */
	xpBoost: number[];
	/** Increase odds in some commands.*/
	luck: number[];
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
				sellRate: 0,
				upgrade: 100e6,
				category: 'Collectible',
				...assets
			},
			config: {
				premium: false,
				sellable: false,
				...config
			},
			upgrades: options.upgrades.map(up => ({ sellRate: 0, ...up })) ?? [],
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