import { MessageOptions } from 'discord.js';
import { Context } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { Command } from '@lib/handlers/command';

export default class Fun extends Command {
	constructor() {
		super('divorce', {
			aliases: ['divorce'],
			channel: 'guild',
			description: 'Divorce your husband or wife!',
			category: 'Fun',
		})
	}

	async exec(ctx: Context): Promise<MessageOptions> {
		const { data: me } = await ctx.db.fetch();
		if (!me.marriage.id) {
			return { replyTo: ctx.id, content: 'You\'re not even married to somebody' };
		}

		const husOrWif = await this.client.users.fetch(me.marriage.id) as UserPlus;
		await ctx.send({ content: `Are you sure you wanna have a divorce with ${husOrWif.username}? Type \`y\` or \`n\` in 30 seconds.` });
		const filt = m => m.author.id === ctx.author.id;
		const resp = (await ctx.channel.awaitMessages(filt, { max: 1, time: 3e4 })).first();

		if (!resp || !['yes', 'y'].includes(resp.content.toLowerCase())) {
			return { replyTo: ctx.id, content: 'I guess not then.' };
		}

		const { data: div } = await ctx.db.fetch(husOrWif.id);
		me.marriage.id = '';
		div.marriage.id = '';
		await me.save();
		await div.save();

		return { replyTo: ctx.id, content: `Divorce against ${husOrWif.tag} successful.` };
	}
}