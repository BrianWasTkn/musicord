import { GuildMember, MessageOptions, MessageAttachment } from 'discord.js';
import { Command, Context } from 'lava/index';

export default class ImageCommand extends Command {
	public constructor() {
		super('abandon', {
			name: 'Abandon',
			channel: 'guild',
			aliases: ['abandon'],
			clientPermissions: ['ATTACH_FILES'],
			args: [{
				id: 'someone',
				type: 'member',
				default: (c: Context) => c.member
			}]
		});
	}

	public async exec(ctx: Context<{ someone: GuildMember }>): Promise<MessageOptions> {
		const generated = await ctx.client.memer.generate('abandon', {
			avatars: [ctx.args.someone.user.avatarURL({ format: 'png', size: 1024 })]
		});

		return { reply: { messageReference: ctx.id }, files: [generated] };
	}
}