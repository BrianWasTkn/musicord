import { Message, MessageOptions, GuildMember } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency'
import { InventorySlot } from '@lib/interface/handlers/item'
import { Argument } from 'discord-akairo'
import { Document } from 'mongoose'
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
          id: 'pageOrMember',
          type: Argument.union('number', 'member'),
          index: 1,
          default: 1,
        },
        {
          id: 'page',
          type: 'number',
          default: 1
        }
      ],
    });
  }

  async exec(
    msg: Message,
    args: {
      pageOrMember: number | GuildMember;
      page: number
    }
  ): Promise<string | MessageOptions> {
    const { handlers, db, util } = this.client;
    const { pageOrMember: pom, page } = args;
    const { item: Items } = this.client.handlers;
    const { fetch } = this.client.db.currency;

    let data: Document & CurrencyProfile;
    if (typeof pom === 'number')
      data = await fetch(msg.member.user.id)
    else
      data = await fetch(pom.user.id);


    let inv: string[] | string[][] | InventorySlot[];
    inv = data.items.filter(i => i.amount >= 1);
    if (inv.length < 1) 
      return 'Imagine not having any items, buy something weirdo';

		inv = util.paginateArray(inv.map(item => {
			const i = Items.modules.get(item.id);
			return `**${i.emoji} ${i.name}** — ${item.amount.toLocaleString()}\n*ID* \`${i.id}\` — ${i.category}`;
		}), 3);

    if ((typeof pom === 'number' ? pom : page) > inv.length) {
      return 'That page doesn\'t even exist wtf are you high or what?';
    }

		return {
			embed: {
				color: 'GOLD',
				author: {
          name: `${(pom as GuildMember).user.username}'s inventory`,
          iconURL: (pom as GuildMember).user.avatarURL({ dynamic: true })
        },
        fields: [{
          name: 'Owned Items',
          value: inv[(typeof pom === 'number' ? pom : page) - 1].join('\n\n')
        }],
        footer: {
          text: `Owned Shits — Page ${(typeof pom === 'number' ? pom : page)} of ${inv.length}`
        }
			}
		}
  }
}
