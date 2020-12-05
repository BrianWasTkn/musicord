import Discord from 'discord.js'

/**
 * Creates a listener class
* @class Listener @exports Listener
 */
export default class Listener {
	constructor(client) {
		/**
		 * A Musicord Client
		 * @type {Discord.Client}
		 */
		this.client = client;
	}

	/**
	 * Creates a simple logger to call for this class
	 * @param {String} msg the tag of the listener
	 * @param {Error} error the error to log
	 * @returns {void}
	 */
	log(msg, error) {
		return this.client.utils.log('Listener', 'error', msg, error);
	}

	/**
	 * Creates an "alias" for a normal discord embed
	 * @param {Object} Options an alternative Discord.MessageEmbed object
	 * @returns {Discord.MessageEmbed} a discord embed object
	 */
	createEmbed({
		author = {}, fields = {}, footer = {},
		title = null, icon = null, text = null,
		color = 'RANDOM'
	} = {}) {
		return this.client.utils.dynamicEmbed({
			author, fields, footer,
			title, text, icon, color
		});
	}
}