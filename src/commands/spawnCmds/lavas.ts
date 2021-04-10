import { GuildMember, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Lava } from '@lib/Lava';

export default class Spawn extends Command {
  constructor() {
    super('lavas', {
      aliases: ['lavas', 'unpaids', 'lvs'],
      channel: 'guild',
      description: "Display yours or someone else's unpaid lava coins.",
      category: 'Spawn',
      cooldown: 5e3,
      args: [
        {
          id: 'member',
          type: 'member',
          default: (message: MessagePlus) => message.member,
        },
      ],
    });
  }

  async exec(
    msg: MessagePlus,
    args: {
      member: GuildMember;
    }
  ): Promise<MessageOptions> {
    const { fetch } = this.client.db.spawns;
    const { user } = args.member;
    const data = await fetch(user.id);

    return { embed: {
      description: `**Total Events:** ${data.eventsJoined.toLocaleString()}\n**Unpaids:** ${data.unpaid.toLocaleString()}`,
      footer: { text: `Payments may take long.` },
      title: `${user.username}'s unpaids`,
      color: 'RANDOM',
    }};
  }
}
