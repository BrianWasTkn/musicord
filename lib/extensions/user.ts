import { Structures, User, UserManager, Collection } from 'discord.js'
import { Lava } from '@lib/Lava'

export class LavaUserManager extends UserManager {
	client: Lava;
	cache: Collection<string, LavaUser>;

	constructor(client: Lava, iterable: Iterable<any>) {
		super(client, iterable);
	}

	async fetch(id: string): Promise<LavaUser> {
		return await super.fetch(id) as LavaUser;
	}
}

export class LavaUser extends User {
	client: Lava;

	constructor(client: Lava, data: object) {
		super(client, data);
	}

	async banGlobal(guilds: string[], reason?: string) {
		return await Promise.all(guilds.map(async (g: string) => {
			const guild = await this.client.guilds.fetch(g);
			const userMember = await guild.members.fetch(this.id);
			return userMember.ban({ reason: reason || 'Banned' });
		}));
	}

	async blacklist(): Promise<LavaUser> {
		return await this.client.users.fetch(this.id); // for now
	}

	toPing() {
		return super.toString();
	}

	toString() {
		return `${this.username}#${this.discriminator}`;
	}
}

Structures.extend('User', () => LavaUser)