import { GuildMember, MessageOptions } from 'discord.js';
import { InventorySlot } from '@lib/interface/handlers/item';
import { Context } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { MemberPlus } from '@lib/extensions/member';
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
          default: (m: Context) => m.member,
        },
      ],
    });
  }

  async exec(ctx: Context<{ member: MemberPlus }>): Promise<MessageOptions> {
    const { pocket, vault, space, items } = (await ctx.db.fetch(ctx.args.member.user.id)).data;
    
    const calc = (i: InventorySlot) => {
      const { modules } = this.client.handlers.item;
      const it = modules.get(i.id);
      return it.cost * i.amount;
    }

    const inv = items.map(calc).reduce((a, b) => a + b, 0);
    const info = {
      'Pocket': pocket.toLocaleString(),
      'Vault': `${vault.toLocaleString()}${ctx.args.member.user.id === ctx.author.id ? `/${space.toLocaleString()}` : ''}`,
      'Inventory': inv.toLocaleString(),
      'Net Worth': (pocket + vault + inv).toLocaleString()
    };

    return { embed: {
      description: Object.entries(info).map(([k, v]) => `**${k}:** ${v}`).join('\n'),
      title: `${ctx.args.member.user.username}'s balance`,
      footer: { text: ctx.guild.name },
      color: 'RANDOM',
    }};
  }
}
