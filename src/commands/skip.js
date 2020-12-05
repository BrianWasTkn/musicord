import Command from '../classes/Command.js'

/**
 * Creates a Skip command class
 * @class @extends {Command}
 */
export default class Skip extends Command {
	constructor(client) {
		super(client, {
			name: 'skip',
			aliases: ['playnext'],
			description: 'Skips the current track playing in the queue.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Music',
			checks: ['voice', 'queue'],
		});
	}

	/**
	 * Executes this command
	 * @param {Object} Options an object of parameters
	 * @param {Musicord} Options.Bot the client instantiated
	 * @param {import'discord.js'.Message} Options.msg the discord msg
	 * @returns {Promise<void>}
	 */
	async execute({ Bot, msg }) {
		try {
			/* Skip */
			await Bot.distube.skip(msg);
		} catch(error) {
			super.log('skip', error);
		}
	}
}