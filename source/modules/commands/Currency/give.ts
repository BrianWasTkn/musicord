import { MemberPlus, UserPlus, Context, ContextDatabase } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Argument } from 'discord-akairo';
import { Command } from 'lib/objects';
import config from 'config/index';

export default class Currency extends Command {
	constructor() {
		super('give', {
			name: 'Gift',
			aliases: ['give', 'share'],
			channel: 'guild',
			description: 'Give coins to others with a flat tax rate of 5%.',
			category: 'Currency',
			cooldown: 10000,
			args: [
				{
					id: 'amount',
					type: Argument.union('number', 'string'),
				},
				{
					id: 'member',
					type: 'member',
				},
			],
		});
	}

	public async exec(
		ctx: Context<{
			amount: number | string;
			member: MemberPlus;
		}>, authorEntry: ContextDatabase
	): Promise<MessageOptions> {
		const { member, amount } = ctx.args;
		if (!member || !amount) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `**Wrong Syntax bro**\n**Usage:** \`lava ${this.id} <amount> <@user>\`` };
		}

		const { data } = authorEntry;
		let give: number;
		if (isNaN(amount as number)) {
			let tAmt = (amount as string).toLowerCase();
			if (tAmt === 'all') {
				give = data.pocket;
			} else if (tAmt === 'half') {
				give = Math.round(data.pocket / 2);
			} else {
				return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: 'Needs to be a whole number yeah?' };
			}
		} else {
			give = amount as number;
		}

		const memberEntry = await (new ContextDatabase(ctx)).fetch(member.user.id);
		const { data: r } = memberEntry;
		if (member.user.id === ctx.author.id)
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: 'lol imagine giving coins to yourself' };
		if (amount > data.pocket)
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `u only have ${data.pocket.toLocaleString()} coins don't try me bruh` };
		if (r.pocket >= config.currency.maxSafePocket)
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `Hah! Having over ${config.currency.maxSafePocket.toLocaleString()} makes them too rich, no thanks.` };
		if (give < 1)
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: 'has to be a number greater than 0' };

		let paid = Math.round(give - give * 0.08);
		let tax = Math.round((give * 0.8) / (give / 10));

		const giver = await authorEntry.removePocket(give).updateQuest({ cmd: this, count: paid }).updateItems().calcSpace().save();
		const recib = await memberEntry.addPocket(paid).updateItems().save();

		return {
			reply: { messageReference: ctx.id, failIfNotExists: false }, content: `You gave ${member.user.username
				} **${paid.toLocaleString()
				}** coins after a **${tax
				}%** tax. You now have **${giver.pocket.toLocaleString()
				}** while they have **${recib.pocket.toLocaleString()
				}** left.`
		};
	}
}
