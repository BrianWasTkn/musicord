import Command from '../Command.js'

export default class extends Command {
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
		if (
			command.category === 'Owner' && 
			!bot.developers.includes(message.author.id)
		) return;
		const r = await this.run(bot, message, args);
		if (!r) return;
		return message.channel.send(r instanceof Object ? { embed: r } : r);
	}
}