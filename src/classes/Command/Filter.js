import Command from '../Command.js'

export default class extends Command {
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

	}
}