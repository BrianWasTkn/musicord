import Util from './Util.js'

export default class Manager {
	constructor(client) {
		this.client = client;
	}

	/** Logger Shortcut */
	log(Class, tag, error) {
		return log(Class, 'manager', tag, error);
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