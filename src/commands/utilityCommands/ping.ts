import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Command } from 'lib/objects';

export default class Util extends Command {
	constructor() {
		super('ping', {
			name: 'Ping',
			name: 'Latency',
			aliases: ['ping', 'pong'],
			channel: 'guild',
			description: 'Checks the average latency across all shards',
			category: 'Utility',
		});
	}

	exec = (ctx: Context): MessageOptions => ({
		replyTo: ctx.id, content: `**Ponge:** ${ctx.guild.shard.ping}ms`
	});
}
