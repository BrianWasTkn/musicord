import { Structures, User, Collection } from 'discord.js';
import { Document } from 'mongoose';
import { Effects } from 'lib/utility';
import { Context } from '.';
import { Lava } from 'lib/Lava';

export class UserPlus extends User {
	public client: Lava;

	get isBotOwner() {
		return this.client.isOwner(this.id);
	}

	async blacklist(ctx: Context, reason = 'No reason provided.') {
		const entry = await ctx.db.fetch(this.id);
		entry.data.bled = true;
		return entry.data.save();
	}
}

export default () => Structures.extend('User', () => UserPlus);
