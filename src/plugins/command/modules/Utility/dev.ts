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

	*args() {
		const sub1: string = yield [
			['ping', 'pang', 'p']
		];

		return Flag.continue(sub1);
	}

	exec(ctx: Context, args: any) {
		ctx.client.console.log('Client', args);
		return ctx.reply('what');
	}
}