import Command from '../classes/Command.js'

export default class Skip extends Command {
	constructor(client) {
		super(client, {
			name: 'skip',
			aliases: ['skip-track'],
			description: 'Skips the current track playing in the queue.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Music',
			checks: ['voice', 'queue'],
		});
	}

	async execute({ Bot, msg, args }) {
		/** Else, Do it */
		try {
			/* Skip */
			await Bot.distube.skip(msg);
		} catch(error) {
			super.log('play', error);
		}
	}
}