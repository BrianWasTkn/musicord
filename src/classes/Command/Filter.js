import Command from '../Command.js'

export default class Filter extends Command {
	constructor(options, fn) {
		super(options, fn);

		/** 
		 * Music Mode
		 * @type {Boolean}
		 */
		this.music = true;

		/**
		 * Command Category
		 * @type {String}
		 */
		this.category = 'Filter';

		/**
		 * Command Cooldown
		 * @type {Number}
		 */
		this.cooldown = 5000;

		/**
		 * Command Visiblity
		 * @type {Boolean}
		 */
		this.private = false;

		/**
		 * Command Aliases
		 * @type {Array<String>}
		 */
		this.aliases = [`toggle-${options.name}`];

		/**
		 * Command Description
		 * @type {String}
		 */
		this.description = `Apply the ${options.name} filter to your favorite songs!`;

		/**
		 * Command Function
		 * @type {Queue}
		 */
		this.run = fn;
	}

	async execute(bot, command, message, args) {
		try {
			// Expect the command function returns the name of the filter
			const filter = this.run(bot, message, args);
			try {
				// Return a message
				await message.channel.send({
					embed: {
						title: 'Filter Applied',
						color: 'GREEN',
						description: `Successfully applied the ${filter} filter.`,
						footer: { text: `Thanks for using ${bot.user.username}!` }
					}
				})
			} catch(error) {
				// Send Error
				await message.channel.send(error.message);
			}
		} catch(error) {
			// Send Error
			await message.channel.send(error.message);
		}
	}
}