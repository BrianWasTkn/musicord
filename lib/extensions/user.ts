import { Structures, User, Collection } from 'discord.js';
import { Document } from 'mongoose';
import { Effects } from 'lib/utility/effects';
import { Lava } from 'lib/Lava';

export class UserPlus extends User {
	public client: Lava;

	get isBotOwner() {
		return this.client.isOwner(this.id);
	}
}

export const ExtendUser = () => Structures.extend('User', () => UserPlus);
