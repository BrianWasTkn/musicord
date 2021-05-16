import { MemberPlus, Context, ContextDatabase } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command, Item } from 'lib/objects';
import { Embed } from 'lib/utility/embed';
import config from 'config/index';

export default class Currency extends Command {
	constructor() {
		super('gift', {
			name: 'Gift',
			aliases: ['gift', 'gi'],
			channel: 'guild',
			description: 'Gift items to others. Sharing is caring, they say.',
			category: 'Currency',
			cooldown: 5e3,
			args: [
				{ id: 'amount', type: 'number' },
				{ id: 'item', type: 'shopItem' },
				{ id: 'member', type: 'member' },
			],
		});
	}

	async exec(
		ctx: Context<{
			member: MemberPlus;
			amount: number;
			item: Item;
		}>, userEntry: ContextDatabase
	): Promise<MessageOptions> {
		const { amount, item, member } = ctx.args;
		if (!amount || !item || !member) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `**Wrong Syntax bro**\n**Usage:** \`lava ${this.aliases[0]} <amount> <item> <@user>\`` };
		}
		if (member.user.id === ctx.author.id) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: 'Lol imagine gifting that to yourself dummy' };
		}

		const { maxInventory: cap } = config.currency;
		const rEntry = await (new ContextDatabase(ctx)).fetch(member.user.id);
		const { data: uData } = userEntry;
		const { data: rData } = rEntry;
		const uInv = item.findInv(uData.items, item);
		const rInv = item.findInv(rData.items, item);

		if (amount < 1) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `you can't gift negative amount of items smh` };
		}
		if (amount > uInv.amount) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `u only have ${uInv.amount.toLocaleString()} of this item` };
		}
		if (rInv > cap) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `they already have more than ${cap.toLocaleString()} of this item!` };
		}

		await rEntry.addInv(item.id, amount).save();
		await userEntry.updateQuest({ cmd: this, count: amount, item }).removeInv(item.id, amount).save(true);

		return {
			reply: { messageReference: ctx.id, failIfNotExists: false },
			content: `You gave ${member.user.username} **${amount.toLocaleString()} ${item.emoji
				} ${item.name}**${amount > 1 ? 's' : ''
				}! They now have **${rInv.amount.toLocaleString()}** ${item.id}${rInv.amount > 1 ? 's' : ''
				} while you have **${uInv.amount.toLocaleString()}** ${item.id}${uInv.amount > 1 ? 's' : ''
				} left.`,
		};
	}
}
