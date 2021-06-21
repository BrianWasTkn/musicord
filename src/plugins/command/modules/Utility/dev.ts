import { Command, Context } from 'lava/index';
import { Flag } from 'discord-akairo';

export default class extends Command {
	constructor() {
		super('dev', {
			aliases: ['dev', 'd'],
			category: 'Utility',
			description: 'Dev tools for you fools',
			name: 'Dev',
			usage: '{command} u dont need docs for dis'
		});
	}

	*args(ctx: Context) {
		const { modules } = ctx.client.handlers.command;
		const subs = this.subCommands.filter(c => c.parent === this.id);
		const sub: string = yield [...subs.map(s => [s.id])];

		return sub ? Flag.continue(sub) : null;
	}

	exec(ctx: Context, args: any) {
		ctx.client.console.log('Client', args);
		return ctx.reply('what');
	}
}