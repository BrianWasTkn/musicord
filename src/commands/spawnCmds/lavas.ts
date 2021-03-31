import { GuildMember, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Lava } from '@lib/Lava';

export default class Spawn extends Command {
  constructor() {
    super('lavas', {
      aliases: ['lavas', 'unpaids', 'lvs'],
      channel: 'guild',
      description: "Displays yours or someone else's lava unpaids",
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
    const user = args.member;
    const data = await fetch(user.id);
    const embed = new Embed()
      .addField('• Events Joined', data.eventsJoined.toLocaleString())
      .addField('• Unpaids', data.unpaid.toLocaleString())
      .setTitle(`${user.user.username}'s unpaid coins`)
      .setFooter(true, 'Payments may take long')
      .setColor('RANDOM');

    return { embed };
  }
}
