import { Context, MemberPlus, ContextDatabase } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';

export default class Util extends Command {
	constructor() {
		super('userinfo', {
			name: 'User Info',
			aliases: ['userinfo', 'ui'],
			channel: 'guild',
			description: 'Check the basic info about a specific user.',
			category: 'Utility',
			args: [{
				id: 'member',
				type: 'member',
				default: (m: Context) => m.member
			}]
		});
	}

	exec = async (ctx: Context<{ member: MemberPlus }>, userEntry: ContextDatabase): Promise<MessageOptions> => {
		const { member: m } = ctx.args;
		const { modules } = this.handler;
		const entry = ctx.author.id === m.user.id ? userEntry : await ctx.db.fetch(m.user.id);
		const { lastRan, cmdsRan, lastCmd } = entry.data;

		return { embed: {
			thumbnail: { url: m.user.avatarURL({ dynamic: true }) }, color: 'RANDOM',
			title: `${m.user.tag} — ${m.user.id}`, fields: Object.entries({
				'Created At': new Date(m.user.createdAt).toDateString(),
				'Joined At': new Date(m.joinedAt).toDateString(),
				'Commands Ran': cmdsRan.toLocaleString(),
				'Avatar URL': `[Click Here](${m.user.avatarURL({ dynamic: true })})`,
				'Nickname': m.nickname != null ? m.nickname : m.user.username,
				'Last Command': modules.get(lastCmd).aliases[0],
			}).map(([name, value]) => ({ name, value, inline: true }))
		}};
	}
}
