import Util from './Util.js'

export default class Manager {
	constructor(client) {
		this.client = client;
	}

	/** Shortcut for logging */
	log(msg, error) {
		return this.client.utils.log('Manager', 'error', msg, error);
	}

	/** Creates an Embed */
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