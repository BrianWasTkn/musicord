import { MessageOptions, FileOptions } from 'discord.js';
import { Command, Context } from 'lava/index';

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
					match: 'rest', 
					default: 'You need some text idiot.' 
				},
			],
		});
	}

	async exec(ctx: Context, { text }: { text: string }) {
		const params = new URLSearchParams();
		params.set('text', text);
		
		return ctx.client.memer.generate('changemymind', params, 'gif')
			.then(g => ctx.channel.send(g));
	}
}