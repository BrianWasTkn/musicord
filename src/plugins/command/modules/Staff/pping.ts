import { SubCommand, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('pping', {
			aliases: ['pping', 'pp'],
			clientPermissions: ['MENTION_EVERYONE'],
			description: 'Ping the Partnership Ping role.',
			name: 'Partner Ping',
			parent: 'staff',
			staffOnly: true,
			usage: '{command} [msg]',
			args: [
				{
					id: 'msg',
					type: 'string',
					match: 'rest',
					default: 'Try this server!'
				}
			]
		});
	}

	async exec(ctx: Context, { msg }: { msg: string }) {
		const role = ctx.guild.roles.cache.get('857158450890801152');
		await ctx.delete();
		return await ctx.channel.send({ 
			content: role.toString(), 
			allowedMentions: {
				roles: [role.id]
			},
			embed: {
				footer: {
					text: ctx.author.username,
					iconURL: ctx.author.avatarURL({ dynamic: true })
				},
				description: msg,
				color: 'GREEN',
				title: ':handshake: Partners :handshake:'
			}
		});
	}
}