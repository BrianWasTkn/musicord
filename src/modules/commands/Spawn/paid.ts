import { Context, MemberPlus, UserPlus } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';
import { Embed } from 'lib/utility';

export default class Spawn extends Command {
	constructor() {
		super('paid', {
			name: 'Spawner Paid',
			aliases: ['paid'],
			description: 'Updates someone elses or your lava unpaid amounts',
			category: 'Spawn',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					id: 'amount',
					type: 'number',
					unordered: true,
				},
				{
					id: 'member',
					type: 'member',
					unordered: true,
					default: (message: Context) => message.member,
				},
			],
		});
	}

	async exec(
		ctx: Context<{
			member: MemberPlus;
			amount: number;
		}>
	): Promise<MessageOptions> {
		const { amount, member } = ctx.args;
		const { fetch } = ctx.client.db.spawns;
		if (!amount || !member) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `**Wrong Syntax**\n**${
				(this.handler.prefix as string[])[0]
			} ${this.aliases[0]} <amount> <@user>` };
		}
		
		const bot = this.client.user;
		const old = await fetch(member.user.id);
		old.unpaid -= amount;
		const d = await old.save();

		if (d.allowDM) {
			await member.user.send({
				embed: {
					author: { name: `${ctx.author.tag} — ${ctx.author.id}`, iconURL: ctx.author.avatarURL({ dynamic: true }) },
					title: `Paid Unpaids`, color: 'GREEN', footer: { text: ctx.guild.name, iconURL: ctx.guild.iconURL() },
					fields: [
						{ name: '• Old Value', value: old.unpaid.toLocaleString() },
						{ name: '• New Value', value: d.unpaid.toLocaleString() },
					]
				}
			});
		}

		const embed = new Embed()
			.addField('• Old Value', old.unpaid.toLocaleString())
			.addField('• New Value', d.unpaid.toLocaleString())
			.setTitle(':white_check_mark: Unpaids Updated.')
			.setFooter(true, bot.username, bot.avatarURL())
			.setColor('GREEN');

		return { embed };
	}
}
