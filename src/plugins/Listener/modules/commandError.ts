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

	get titleCD() {
		return ['Chill', 'Hold Up', 'Bruh calm down'];
	}

	exec(error: Error, ctx: Context, cmd: Command) {
		console.error(error);
		ctx.reply('Something wrong occured.');
	}
}