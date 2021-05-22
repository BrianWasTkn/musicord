import { User as BaseUser, Structures, Collection } from 'discord.js';
import { LavaClient, InventoryManager, Inventory } from '../..';

export class User extends BaseUser {
	public client: LavaClient;

	public get inventory() {
		return (inventory: InventorySlot[]) => {
			const items = inventory.map(slot => new Inventory(this.client, slot));
			return new InventoryManager(this, this.client.itemHandler, items);
		}
	}
}

Structures.extend('User', () => User);