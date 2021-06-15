import { Listener, Context, Command } from 'lava/index';

export default class extends Listener {
	constructor() {
		super('commandError', {
			category: 'Command',
			emitter: 'command',
			event: 'error',
			name: 'Command Error'
		});
	}

	exec(error: Error, ctx: Context, cmd: Command) {
		this.client.console.error('Command', error, true);
		ctx.reply('Something wrong occured :c');
	}
}