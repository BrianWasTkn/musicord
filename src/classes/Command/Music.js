import Command from '../Command.js'

export default class MusicCommand extends Command {
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
		this.category = 'Music';

		/**
		 * Command Cooldown
		 * @type {Number}
		 */
		this.cooldown = 3000;

		/**
		 * Command Visiblity
		 * @type {Boolean}
		 */
		this.private = false;

	}
}