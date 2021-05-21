import { Flag, ArgumentGenerator } from 'discord-akairo';
import { Command, Context } from 'src/library';
import { MessageOptions } from 'discord.js';

export default class Utility extends Command {
	public constructor() {
		super('generator', {
			name: 'Generator',
			channel: 'guild',
			aliases: ['generator', 'gen'],
			category: 'Utility',
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	public *args(ctx: Context) {
		const method: string = yield {
		    type: [
				['show-people', 'people', 'ppl'],
				['show-bots', 'bots'],
				['show-x', 'x', 'xs'],
		    ],
		};

		return Flag.continue(method);
	}

	public exec(ctx: Context): MessageOptions {
		console.log(ctx.args);
		return { 
			content: 'Logged.',
			reply: { 
				messageReference: ctx.id, 
				failIfNotExists: true 
			} 
		};
	}
}