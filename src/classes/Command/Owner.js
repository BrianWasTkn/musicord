import Command from '../Command.js'
import { log } from '../../utils/logger.js'

export default class Owner extends Command {
	constructor(options, fn) {
		super(options, fn);

		/** 
		 * Music Mode
		 * @type {Boolean}
		 */
		this.music = false;

		/**
		 * Command Category
		 * @type {String}
		 */
		this.category = 'Owner';

		/**
		 * Command Cooldown
		 * @type {Number}
		 */
		this.cooldown = 0;

		/**
		 * Command Visiblity
		 * @type {Boolean}
		 */
		this.private = true;
		/**
		 * Command Function
		 * @type {*}
		 */
		this.run = fn;
	}

	async execute(bot, message, command, args) {
		if (!bot.developers.includes(message.author.id)) return;
		try {
			const r = await this.run(bot, message, args);
			if (!r) return;
			else try {
				await message.channel.send(r);
			} catch(error) {
				log('commandError', 'command@send_message', error);
			}
		} catch(error) {
			log('commandError', 'command@execute', error);
		}
	}
}