import { log } from '../utils/logger.js'

class Listener {
	constructor(client) {
		this.client = client;
	}

	/** Logger Shortcut */
	log(tag, error) {
		return log('listener', tag, error);
	}

	/** Creates an Embed */
	createEmbed({ 
		author = {}, footer = {}, fields = {},
		title = null, icon = null, text = null,
		color = 'RANDOM'
	} = {}) {
		return {
			embed: {
				author: { name: author.text, iconURL: author.icon },
				title: title,
				thumbnail: icon,
				color: color,
				description: text,
				fields: Object.entries(fields).map(f => ({ name: f[0], value: f[1].content, inline: f[1].inline || false })),
				footer: { text: footer.text, iconURL: footer.icon }
			}
		}
	}
}

export default Listener;