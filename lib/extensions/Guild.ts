import { Lava } from 'lib/Lava';
import { 
	FetchMembersOptions, 
	FetchMemberOptions, 
	GuildMember, 
	Structures, 
	Guild, 
} from 'discord.js';

export class GuildPlus extends Guild {
	public client: Lava;
	public guild: this;

	getMembers(
		filter: (member: GuildMember) => boolean = (() => true), 
		options: Partial<FetchMemberOptions> = {}
	) {
		return this.members.fetch(options)
			.then(members => members.filter(filter))
			.catch(console.error);
	}
}

export default () => Structures.extend('Guild', () => GuildPlus);