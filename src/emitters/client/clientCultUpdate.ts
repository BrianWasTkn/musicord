import { GuildMember, TextChannel } from 'discord.js';
import { Listener } from '@lib/handlers';

const cults = {
	wastaken: '768812126633984021',
	probber: '790379642359119902',
	chips: '824984193170931782',
};

export default class ClientListener extends Listener {
  constructor() {
    super('cult', {
      emitter: 'client',
      event: 'guildMemberUpdate',
    });
  }

  async exec(o: GuildMember, n: GuildMember): Promise<void> {
  	if (o.nickname === n.nickname) return;
  	if (n.partial) await n.fetch(true);

  	const roles = Object.values(cults);
  	const keys = Object.keys(cults);

  	const gRoles = n.guild.roles.cache.filter((r, i) => r.id === roles[i]);
  	const matchingRoles = [...gRoles.values()].filter(r => r.name.toLowerCase().includes(n.nickname.toLowerCase()));  	

  	if (matchingRoles.length >= 1) {
  		await n.roles.add(matchingRoles[0].id);
  	} else {
  		await Promise.all([...roles.map(r => n.roles.remove(r))]);
  	}
  }
}