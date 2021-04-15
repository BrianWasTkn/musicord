import { GuildMember, TextChannel } from 'discord.js';
import { Listener } from '@lib/handlers';

const cults = {
	probber: '790379642359119902',
	chips: '824984193170931782',
	wastaken: '768812126633984021',
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

  	const matchingRoles = [...n.guild.roles.cache.values()]
  	.filter(r => n.nickname.toLowerCase().includes(r.name));
  	const ids = roles.map(r => matchingRoles.find(mr => mr.id === r));

  	if (matchingRoles.length >= 1) {
  		// Promise.race big flex
  		await Promise.race([...ids.map(r => n.roles.add(r))]);
  	} else {
  		await Promise.all([...roles.map(r => n.roles.remove(r))]);
  	}
  }
}
