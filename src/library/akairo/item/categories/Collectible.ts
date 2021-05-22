import { Item, ItemOptions } from '..';
import { MessageOptions } from 'discord.js';
import { Context } from '../../..';

export interface CollectibleItemOptions extends ItemOptions {}

export class CollectibleItem extends Item {
	public constructor(id: string, options: Omit<CollectibleItemOptions, 'category'>) {
		super(id, { ...options, category: 'Collectible' });
	}

	public async use(ctx: Context, times: number): Promise<MessageOptions> {
		const userEntry = await ctx.currency(ctx.author.id);
		const thisItem = userEntry.findInventoryItem(this.id);

		return { content: `**${this.info.emoji} WHAT A FLEX!**\nImagine having **${thisItem.owned.toLocaleString()}**, couldn't be me` };
	}
}