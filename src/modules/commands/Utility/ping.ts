import { Command, Context } from 'src/library';
import { MessageOptions } from 'discord.js';

export default class Utility extends Command {
	public constructor() {
		super('ping', {
			name: 'Ping',
			channel: 'guild',
			aliases: ['ping', 'pong'],
			category: 'Utility',
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	public exec = (ctx: Context): MessageOptions => ({
		content: `**:ping_pong: Ponge:** \`${ctx.guild.shard.ping}ms\``,
		reply: { messageReference: ctx.id, failIfNotExists: true },
	});
}