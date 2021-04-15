import { GuildMember, TextChannel } from 'discord.js';
import { Listener } from '@lib/handlers';

const cults = {
	probber: '790379642359119902',
	chips: '824984193170931782',
	wastaken: '768812126633984021 ',
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

  	const keys = Object.keys(cults);
  	const roles = Object.values(cults);
  	const found = keys.find(k => n.nickname.toLowerCase().includes(k));
  	if (found) {
  		await n.roles.add(found);
  	} else {
  		await n.roles.remove(roles
  			.map(r => {
  				return n.guild.roles.cache.get(r);
  			})
  			.find(r => {
  				return roles.some(ro => ro === r.id);
  			}).id
  		);
  	}
  }
}
