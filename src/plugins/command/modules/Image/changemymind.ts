import { Command, Context } from 'lava/index';
import { MessageOptions } from 'discord.js';

export default class extends Command {
	constructor() {
		super('changemymind', {
			aliases: ['changemymind'],
			channel: 'guild',
			clientPermissions: ['ATTACH_FILES'],
			name: 'Change My Mind',
			args: [
				{ 
					id: 'text', 
					type: 'string', 
					default: 'You need some text idiot.' 
				},
			],
		});
	}

	exec(ctx: Context<{ text: string }>): Promise<MessageOptions> {
		return ctx.client.memer.generate('changemymind', {
			text: ctx.args.text
		}).then((buffer: Buffer) => ({
			reply: { messageReference: ctx.id, failIfNotExists: false },
			files: [buffer]
		})).catch(e => ({
			reply: { messageReference: ctx.id },
			content: e.message || 'Something went wrong.'
		}));
	}
}