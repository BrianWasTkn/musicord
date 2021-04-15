import { GuildMember, MessageOptions } from 'discord.js';
import { InventorySlot } from '@lib/interface/handlers/item';
import { MessagePlus } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { Command } from '@lib/handlers/command';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('balance', {
      aliases: ['balance', 'bal'],
      channel: 'guild',
      description: "Check yours or someone else's lava balance.",
      category: 'Currency',
      cooldown: 5e2,
      args: [
        {
          id: 'member',
          type: 'member',
          default: (m: MessagePlus) => m.member,
        },
      ],
    });
  }

  public async exec(
    msg: MessagePlus,
    args: { member: GuildMember }
  ): Promise<MessageOptions> {
    const { pocket, vault, space, items } = await (args.member.user as UserPlus).fetchDB();
    
    function calc(i: InventorySlot) {
      const { modules } = this.client.handlers.item;
      const it = modules.get(i.id);
      return it.cost * i.amount;
    }

    const inv = items.map(calc).reduce((a, b) => a + b, 0);
    const info = {
      'Pocket': pocket.toLocaleString(),
      'Vault': `${vault.toLocaleString()}${args.member.user.id === msg.author.id ? `/${space.toLocaleString()}` : ''}`,
      'Inventory': inv.toLocaleString(),
      'Net Worth': (pocket + vault + inv).toLocaleString()
    };

    return { embed: {
      description: Object.entries(info).map(([k, v]) => `**${k}:** ${v}`).join('\n'),
      title: `${args.member.user.username}'s balance`,
      footer: { text: msg.guild.name },
      color: 'RANDOM',
    }};
  }
}
