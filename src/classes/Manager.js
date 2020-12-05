import Discord from "discord.js";

/**
 * Represents a MusicordManager class
 */
export default class Manager {
	constructor(client) {
		/**
		 * A Musicord client
		 * @type {Discord.Client}
		 */
		this.client = client;
	}

	/**
	 * Shortcut for logging
	 * @param {String} msg the tag for the manager
	 * @param {Error} error a discord.js/javascript error
	 */
	log(msg, error) {
		return this.client.utils.log('Manager', 'error', msg, error);
	}

	/**
	 * Creates an alternative embed from the native one.
	 * @param {Object} Options Embed parameters
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