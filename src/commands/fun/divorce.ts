import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
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

	async exec(msg: MessagePlus): Promise<MessageOptions> {
		const me = await msg.author.fetchDB();
		if (!me.marriage.id) {
			return { replyTo: msg.id, content: 'You\'re not even married to somebody' };
		}

		const husOrWif = await this.client.users.fetch(me.marriage.id) as UserPlus;
		await msg.channel.send(`Are you sure you wanna have a divorce with ${husOrWif.username}? Type \`y\` or \`n\` in 30 seconds.`);
		const filt = m => m.author.id === msg.author.id;
		const resp = (await msg.channel.awaitMessages(filt, { max: 1, time: 3e4 })).first();

		if (!resp || !['yes', 'y'].includes(resp.content.toLowerCase())) {
			return { content: 'I guess not then.' };
		}

		const div = await this.client.db.currency.fetch(husOrWif.id);

		me.marriage.id = '';
		await me.save();

		div.marriage.id = '';
		await div.save();

		return { replyTo: msg.id, content: `Divorce successfull.` };
	}
}