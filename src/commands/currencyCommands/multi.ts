import { GuildMember, MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Command } from 'lib/objects';
import { Embed } from 'lib/utility';
import config from 'config/index';

export default class Currency extends Command {
	constructor() {
		super('multi', {
			name: 'Multipliers',
			aliases: ['multi', 'multiplier'],
			channel: 'guild',
			description: 'View your current multipliers.',
			category: 'Currency',
			cooldown: 1e3,
			args: [
				{
					id: 'page',
					type: 'number',
					default: 1,
				},
			],
		});
	}

	public async exec(
		ctx: Context<{ page: number }>
	): Promise<MessageOptions> {
		const { maxMulti } = config.currency;
		const { utils } = this.client.db.currency;
		const { util } = this.client;
		const { page } = ctx.args;
		const entry = await ctx.db.fetch();
		const multi = utils.calcMulti(ctx, entry.data);

		const multis = util.paginateArray(multi.unlocked, 5);
		if (page > multis.length) {
			return { replyTo: ctx.id, content: "That page doesn't exist." };
		}

		const embed: Embed = new Embed()
			.addField(
				`Total Multi — ${multi.total >= maxMulti ? maxMulti : multi.total}%`,
				multis[page - 1].join('\n')
			)
			.setAuthor(
				`${ctx.member.user.username}'s multipliers`,
				ctx.author.avatarURL({ dynamic: true })
			)
			.setFooter(
				false,
				`${multi.unlocked.length}/${multi.multis} active — Page ${page} of ${multis.length}`
			)
			.setColor('BLURPLE');

		await entry.save();
		return { embed };
	}
}
