import { Structures } from 'discord.js'
import config from '../config.js'

export default Structures.extend('Message', Message => {
	class ExtendedMessage extends Message {
		constructor(client, data, channel) {
			super(client, data, channel);
			client.on('message', msg => {
				// Bot Prefix
				let prefix = false;
				for (const p of bot.config.prefix) {
					if (msg.content.toLowerCase().startsWith(pref)) prefix = p;
				}
				if (!prefix) return;

				const [, ...args] = msg.content
				.slice(prefix.length)
				.split(/ +/g);

				Object.assign(this, { args: args });
			});
		}
	}

	return ExtendedMessage;
})