import { Item, ItemOptions } from '..';
import { MessageOptions } from 'discord.js';
import { Context } from '../../..';

export interface CollectibleItemOptions extends ItemOptions {}

export class CollectibleItem extends Item {
	public constructor(id: string, options: Omit<CollectibleItemOptions, 'category'>) {
		super(id, { ...options, category: 'Collectible' });
	}

	public async use(ctx: Context, times: number): Promise<MessageOptions> {
		return { content: 'noob.' };
	}
}