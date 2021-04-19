import { TextChannel } from 'discord.js';
import { MemberPlus } from '@lib/extensions';
import { Listener } from '@lib/handlers';
import { Lava } from '@lib/Lava';

const cults = {
  taken: '768812126633984021',
  probber: '790379642359119902',
  chips: '824984193170931782',
};

export default class ClientListener extends Listener<Lava> {
  constructor() {
    super('cult', {
      emitter: 'client',
      event: 'guildMemberUpdate',
    });
  }

  async exec(o: MemberPlus, n: MemberPlus): Promise<void> {
    if (o.nickname === n.nickname) return;
    if (n.partial) await n.fetch(true);
    if (!this.client.isOwner(n.user.id)) return;

    const [roles, keys] = [Object.values(cults), Object.keys(cults)];
    const matchingRoles = [...n.guild.roles.cache.values()].filter((r) =>
      keys.some(k => r.name.toLowerCase().includes(k) && n.nickname.toLowerCase().includes(k))
    );
    const logs = n.guild.channels.cache.get('809489910351921192') as TextChannel;

    if (matchingRoles.length >= 1) {
      logs.send(`**Member:** ${n.user.tag}\n**Old Nick:** ${o.nickname}\n**New Nick:** ${n.nickname}\n**Roles:** ${matchingRoles.map(r => r.name).join(', ')}`);
      const memberInGuild = await n.guild.members.fetch(n.user.id);
      const role = matchingRoles[0];
      await memberInGuild.roles.add(role.id);
      logs.send(`Added ${role} to ${n.user.tag}`)
      // await n.roles.add(matchingRoles[0].id);
    } else {
      logs.send('Removed.');
      // await Promise.all([...roles.map((r) => n.roles.remove(r))]);
    }
  }
}
