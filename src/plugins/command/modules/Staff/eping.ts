import { SubCommand, Context } from 'lava/index';

export default class extends SubCommand {
	constructor() {
		super('eping', {
			aliases: ['eping', 'ep'],
			clientPermissions: ['MENTION_EVERYONE'],
			description: 'Ping the Event Ping role.',
			name: 'Event Ping',
			parent: 'staff',
			staffOnly: true,
			usage: '{command} [msg]',
			args: [
				{
					id: 'msg',
					type: 'string',
					match: 'rest',
					default: 'Enjoy the event!'
				}
			]
		});
	}

	async exec(ctx: Context, { msg }: { msg: string }) {
		const role = ctx.guild.roles.cache.get('704013651887128707');
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
				color: 'BLUE',
				title: ':tada: Event Time :tada:'
			}
		});
	}
}