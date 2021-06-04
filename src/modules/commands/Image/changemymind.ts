import { MessageOptions, MessageAttachment } from 'discord.js';
import { Command, Context } from 'lava/index';

export default class ImageCommand extends Command {
	public constructor() {
		super('changemymind', {
			name: 'Change My Mind',
			channel: 'guild',
			aliases: ['changemymind'],
			category: 'Image',
			clientPermissions: ['ATTACH_FILES'],
			args: [{
				id: 'something',
				type: 'string',
				default: 'you need something to change your mind'
			}]
		});
	}

	public async exec(ctx: Context<{ something: string }>): Promise<MessageOptions> {
		const generated = await ctx.client.memer.generate('changemymind', {
			text: ctx.args.something
		});

		return { reply: { messageReference: ctx.id }, files: [generated] };
	}
}