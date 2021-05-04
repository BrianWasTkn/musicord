import { Structures, GuildMember, Guild } from 'discord.js';
import { UserPlus } from './user';
import { Lava } from 'lib/Lava';

export class MemberPlus extends GuildMember {
	public user: UserPlus;
	public client: Lava;

	public get isGuildOwner(): boolean {
		return this.guild.owner.user.id === this.user.id;
	}
	
	public getColor(hex = false) {
		return hex ? this.displayHexColor : this.displayColor;
	}

	public fetchData() {
		return this.client.db.currency.fetch(this.user.id);
	}
}

export default () => Structures.extend('GuildMember', () => MemberPlus);
