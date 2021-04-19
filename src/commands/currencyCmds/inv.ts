import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { MessageOptions } from 'discord.js';
import { InventorySlot } from '@lib/interface/handlers/item';
import { MemberPlus } from '@lib/extensions/member';
import { Context } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { Document } from 'mongoose';
import { Command } from '@lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('inventory', {
      aliases: ['inv', 'items'],
      channel: 'guild',
      description: 'Check your inventory.',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'member',
          default: 1,
          type: (msg: Context, phrase: string) => {
            if (!phrase) return 1; // inventory page
            const { resolver } = this.handler;
            return (
              resolver.type('number')(msg, phrase) ||
              resolver.type('memberMention')(msg, phrase)
            );
          },
        },
        {
          id: 'page',
          type: 'number',
          default: 1,
        },
      ],
    });
  }

  async exec(ctx: Context<{
    member: number | MemberPlus;
    page: number
  }>): Promise<string | MessageOptions> {
    const { util, handlers } = ctx.client;
    const { member, page } = ctx.args;
    const { item: Items } = handlers;
    const isNum = typeof member === 'number';

    let inv: string[] | string[][] | InventorySlot[];
    let total: number = 0;
    let data: Document & CurrencyProfile;
    let memb: MemberPlus;
    let pg: number;

    memb = (isNum ? ctx.member : member) as MemberPlus;
    pg = (isNum ? member : page) as number;
    data = await (memb.user as UserPlus).fetchDB();
    inv = data.items.filter((i) => i.amount >= 1);
    total = inv.reduce((e, a) => a.amount + e, 0);
    if (inv.length < 1) {
      return 'Breh buy at least one item from the shop yeah?';
    }

    inv = util.paginateArray(
      Array.from(Items.modules.values())
      .map((mod) => mod.id)
      .sort() // alphabetical order of IDs
      .map((mod) => {
        const it = Items.modules.get(mod);
        return data.items.find(i => i.id === it.id);
      })
      .filter((i) => i.amount >= 1)
      .map((inv) => {
        const it = Items.modules.get(inv.id);
        const iv = data.items.find(i => i.id === it.id);
        return `**${it.emoji} ${it.name}** — ${iv.amount.toLocaleString()}\n*ID* \`${it.id}\` — ${it.category.id}`;
      }),
      5
    );

    if (pg > inv.length) {
      return `No because that page doesn't exist.`;
    }

    return { embed: {
      color: 'BLURPLE',
      author: {
        name: `${memb.user.username}'s inventory`,
        iconURL: memb.user.avatarURL({ dynamic: true }),
      },
      fields: [
        {
          name: `Owned Items — ${total.toLocaleString()} total`,
          value: inv[pg - 1].join('\n\n'),
        },
      ],
      footer: {
        text: `Owned Items — Page ${pg} of ${inv.length}`,
      },
    }};
  }
}
