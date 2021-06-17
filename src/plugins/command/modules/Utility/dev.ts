import { Command, Context } from 'lava/index';
import { Flag } from 'discord-akairo';

export default class extends Command {
	constructor() {
		super('dev', {
			aliases: ['dev', 'd'],
			description: 'joe mama',
			name: 'Joe Mama',
		});
	}

	*args(ctx: Context) {
		const sub: string = yield [
			['ping']
		];

		return sub ? Flag.continue(sub) : null;
	}

	exec(ctx: Context, args: any) {
		ctx.client.console.log('Client', args);
		return ctx.reply('what');
	}
}