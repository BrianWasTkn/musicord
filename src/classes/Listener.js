export default class Listener {
	constructor(client) {
		this.client = client;
	}

	/** Shortcut for logging */
	log(Class, tag, error) {
		return this.client.utils.log(Class, 'listener', tag, error);
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