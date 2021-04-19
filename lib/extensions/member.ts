import { Structures, GuildMember, Guild } from 'discord.js';
import { UserPlus } from './user';
import { Lava } from '@lib/Lava';

type Constructor = [Lava, object, Guild];

export class MemberPlus extends GuildMember {
	public user: UserPlus;
	public client: Lava;

	public constructor(...args: Constructor) {
		super(...args);
	}

	getColor(hex = false) {
		return hex ? this.displayHexColor : this.displayColor;
	}

	getData() {
		return this.client.db.currency.fetch(this.user.id);
	}
}

export default () => {
	return Structures.extend('GuildMember', () => MemberPlus);
}