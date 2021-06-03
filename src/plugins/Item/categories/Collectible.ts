import { Context, Item, ItemOptions } from 'src/library';
import { MessageOptions } from 'discord.js';

export interface CollectibleItemOptions extends ItemOptions {}

/**
 * The perks aka "entities" for this collectible.
 */
export interface Entity {
	/**
	 * The additional dice roll on gambling.
	 */
	dice?: ArrayUnion<number>;
	/**
	 * The discount debuffed if they buy an item.
	 */
	discount?: ArrayUnion<number>;
	/**
	 * The possible rewarded multis if they own one of this.
	 */
	multipliers?: ArrayUnion<number>;
	/**
	 * The possible steal shields if they own this collectible.
	 */
	shield?: ArrayUnion<number>;
	/**
	 * The possible slot odd to hit a jackpot.
	 */
	slots?: ArrayUnion<number>;
	/**
	 * The additional winnings for all gambling games, except slots.
	 */
	winnings?: ArrayUnion<number>;
}

export abstract class CollectibleItem extends Item {
	/**
	 * Possible perks if they own this collectible.
	 */
	public abstract get entity(): Entity;
	/**
	 * Constructor for this goldshit.
	 */
	public constructor(id: string, options: Partial<Omit<CollectibleItemOptions, 'category'>>) {
		const {
			name,
			upgrades,
			config = {
				showInInventory: true,
				showInShop: true,
				sellable: false,
				buyable: true,
				premium: false,
				retired: false,
				usable: true
			},
			info = {
				emoji: ':thinking:',
				name: 'Collectible Item',
				sell: 0,
				buy: 1000000000,
			},
			description = {
				short: 'A very unique and unknown collectible.',
				long: 'High-value collectible for rich dudes.'
			}
		} = options;

		super(id, { name, upgrades, config, info, description, category: 'Collectible' });
	}

	/**
	 * Method to use this collectible.
	 */
	public async use(ctx: Context): Promise<MessageOptions> {
		const thisItem = await ctx.currency.fetch(ctx.author.id).then(d => d.items.get(this.id));
		return { reply: { messageReference: ctx.id }, content: `**${this.info.emoji} WHAT A FLEX!**\nImagine having **${thisItem.owned.toLocaleString()}**, couldn't be me` };
	}
}