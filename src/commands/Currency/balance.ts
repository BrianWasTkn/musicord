import { GuildMember, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('balance', {
      aliases: ['balance', 'bal'],
      channel: 'guild',
      description: "Check yours or someone else's lava balance.",
      category: 'Currency',
      cooldown: 1e3,
      args: [
        {
          id: 'member',
          type: 'member',
          default: (m: MessagePlus) => m.member
        },
      ],
    });
  }

  public async exec(msg: MessagePlus, args: { member: GuildMember }): Promise<MessageOptions> {
    const { pocket, vault, space, items } = await msg.fetchDB(args.member.user.id);
    const handler = this.client.handlers.item;
    const net = items
      .map(i => {
        const it = handler.modules.get(i.id);
        return it.cost * i.amount;
      })
      .reduce((a, b) => {
        return a + b;
      });

    const dpn: string[] = [];

    [ `**Pocket:** ${pocket.toLocaleString()}`,
      `**Vault:** ${vault.toLocaleString()}/${space.toLocaleString()}`,
      `**Inventory:** ${net.toLocaleString()}`,
      `**Net Worth:** ${(pocket + vault + net).toLocaleString()}`
    ].forEach((i) => dpn.push(i));

    return {
      embed: {
        title: `${args.member.user.username}'s balance`,
        footer: { text: 'discord.gg/memer'},
        description: dpn.join('\n'),
        color: 'RANDOM',
      }
    }
  }
}
