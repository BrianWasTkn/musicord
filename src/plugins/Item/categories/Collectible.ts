import { Context, Item, ItemOptions } from 'src/library';
import { MessageOptions } from 'discord.js';

export interface CollectibleItemOptions extends ItemOptions {}

export class CollectibleItem extends Item {
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
				long: 'Unknown collectible but keep it until it\'s exposure!'
			}
		} = options;

		super(id, { name, upgrades, config, info, description, category: 'Collectible' });
	}

	public async use(ctx: Context, times: number): Promise<MessageOptions> {
		const thisItem = await ctx.currency.fetch(ctx.author.id).then(d => d.items.get(this.id));
		return { reply: { messageReference: ctx.id }, content: `**${this.info.emoji} WHAT A FLEX!**\nImagine having **${thisItem.owned.toLocaleString()}**, couldn't be me` };
	}
}