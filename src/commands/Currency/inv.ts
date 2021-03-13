import { Message, MessageOptions, GuildMember } from 'discord.js';
import { InventorySlot } from '@lib/interface/handlers/item'
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
          id: 'page',
          type: 'number',
          default: 1
        },
				{
					id: 'member',
					type: 'member',
					default(msg: Message) {
						return msg.member;
					}
        },
      ],
    });
  }

  async exec(
    msg: Message,
    args: {
      member: GuildMember;
      page: number
    }
  ): Promise<string | MessageOptions> {
    const { handlers, db, util } = this.client;
    const { member, page } = args;
    const { item: Items } = this.client.handlers;
    const { fetch } = this.client.db.currency;
    const data = await fetch(member.user.id);
    let inv: string[] | string[][] | InventorySlot[];

    inv = data.items.filter(i => i.amount >= 1);
    if (inv.length < 1) 
      return 'Imagine not having any items, buy something weirdo';

		inv = util.paginateArray(inv.map(item => {
			const i = Items.modules.get(item.id);
			return `**${i.emoji} ${i.name}** — ${item.amount.toLocaleString()}\n*ID* \`${i.id}\` — ${i.category}`;
		}), 3);

    if (page > inv.length) {
      return 'That page doesn\'t even exist wtf are you high or what?';
    }

		return {
			embed: {
				color: 'GOLD',
				author: {
          name: `${member.user.username}'s inventory`,
          iconURL: member.user.avatarURL({ dynamic: true })
        },
        fields: [{
          name: 'Owned Items',
          value: inv[page - 1].join('\n\n')
        }],
        footer: {
          text: `Owned Shits — Page ${page} of ${inv.length}`
        }
			}
		}
  }
}
