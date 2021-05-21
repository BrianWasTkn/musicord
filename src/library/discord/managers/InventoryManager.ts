import { LavaClient, Item, ItemHandler } from '../..';
import { AbstractManager } from '..';
import { Snowflake } from 'discord.js';

export class InventoryManager extends AbstractManager<ItemHandler, Snowflake, Item, string | Item> {
	public constructor(client: LavaClient, handler: ItemHandler, iterable: Iterable<Item>) {
		super(client, handler, iterable, Item);
	}
}