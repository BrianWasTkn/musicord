import { Context, MemberPlus } from 'lib/extensions';
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

	exec = async (ctx: Context<{ member: MemberPlus }>): Promise<MessageOptions> => {
		const { member: m } = ctx.args;
		const { data } = await ctx.db.fetch();

		return { embed: {
			thumbnail: { url: m.user.avatarURL({ dynamic: true }) }, color: 'RANDOM',
			title: [m.user.username, m.user.id].join(' — '), fields: Object.entries({
				'Joined At': new Date(m.joinedAt).toDateString(),
				'Created At': new Date(m.user.createdAt).toDateString(),
				'Nickname': m.nickname != null ? m.nickname : m.user.username,
				'Last Command': data.lastCmd,
				'Command Timestamp': new Date(data.lastRan).toDateString(),
			}).map(([name, value]) => ({ name, value, inline: true }))
		}};
	}
}
