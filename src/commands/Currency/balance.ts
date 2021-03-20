import { Message, GuildMember, MessageOptions } from 'discord.js';
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
          default: (m: Message) => m.member
        },
      ],
    });
  }

  public async exec(_: Message, args: { member: GuildMember }): Promise<MessageOptions> {
    const { updateItems } = this.client.db.currency;
    const { member } = args;
    const { pocket, vault, space, items } = await updateItems(member.user.id);
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
        title: `${member.user.username}'s balance`,
        footer: { text: 'discord.gg/memer'},
        description: dpn.join('\n'),
        color: 'RANDOM',
      }
    }
  }
}
