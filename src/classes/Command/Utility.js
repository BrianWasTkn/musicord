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
		this.category = 'Utility';

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