import { MessageOptions, GuildMember } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('gift', {
      aliases: ['gift', 'gi'],
      channel: 'guild',
      description: 'Gift items to others.',
      category: 'Currency',
      cooldown: 5e3,
      args: [
      	{ id: 'amount', type: 'number' },
      	{ id: 'item', type: 'shopItem' },
      	{ id: 'member', type: 'member' }
      ]
    });
  }

  async exec(msg: MessagePlus, args: {
  	amount: number,
  	item: Item,
  	member: GuildMember
  }): Promise<string | MessageOptions> {
  	const { amount, item, member } = args;
  	if (!amount || !item || !member) {
  		return `**Wrong Syntax bro**\n**Usage:** \`lava ${this.aliases[0]} <amount> <item> <@user>\``;
  	}

  	const cap = this.client.config.currency.maxInventory;
  	const data = await msg.author.fetchDB();
  	const dInv = data.items.find(i => i.id === item.id);
  	const r = await msg.fetchDB(member.user.id);
  	const rInv = r.items.find(i => i.id === item.id);

  	if (amount < 1) {
  		return `Bro what the heck, you can't gift negative items smh`;
  	}
  	if (amount > dInv) {
  		return `Meh, you only have ${dInv.amount.toLocaleString()} of this item, i guess you're too broke to gift many items then.`;
  	}
  	if (rInv > cap) {
  		return `They already have more than ${cap.toLocaleString()} of this item!`;
  	}

  	dInv.amount -= amount;
  	await data.save();
  	rInv.amount += amount;
  	await r.save();

  	return { replyTo: msg.id, content: `You gave ${member.user.username} **${amount.toLocaleString()} ${item.emoji} ${item.name}**${amount > 1 ? 's' : ''}! They now have **${rInv.amount.toLocaleString()}** ${item.id}${rInv.amount > 1 ? 's' : ''} while you have **${dInv.amount.toLocaleString()}** ${item.id}${dInv.amount > 1 ? 's' : ''} left.` };
  }
}
