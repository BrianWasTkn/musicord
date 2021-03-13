import { Message, MessageOptions, GuildMember } from 'discord.js';
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
					type: 'member',
					default(msg: Message) {
						return msg.member;
					}
        }
      ],
    });
  }

  async exec(
    msg: Message,
    args: {
      member: GuildMember;
    }
  ): Promise<string | MessageOptions> {
    const { item: Items } = this.client.handlers;
    const { member } = args;
    const { fetch } = this.client.db.currency;
    const data = await fetch(member.user.id);
		
		const inv = data.items.map(item => {
			const i = Items.modules.get(item.id);
			return `**${i.emoji} ${i.name}** — [${item.amount.toLocaleString()}](https://discord.gg/memer)`
		});

		return {
			embed: {
				title: `${member.user.username}'s inventory`,
				description: inv.length > 0 ? inv.join('\n') : 'No items found.',
				color: 'GOLD'
			}
		}
  }
}
