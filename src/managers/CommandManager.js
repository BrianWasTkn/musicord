import Manager from '../classes/Manager.js'
const { Constants: Events } = require('discord.js');

export default class CommandManager extends Manager {
	constructor(client) {
		super(client);
		/* Handle */
		client.on(Events.MESSAGE_CREATE, message => this.handle({ 
			Bot: this.client, msg: message 
		}));
	}

	async handle({ Bot, msg }) {
		if (msg.channel.type !== 'dm' && !msg.author.bot) {
			if (!msg.content.startsWith(Bot.prefix)) return;

			const args = msg.content.slice(Bot.prefix).trim().split(/ +/g);
			const cmd = args.shift();

			if (cmd === 'test') {
				await msg.channel.send('from cmd manager');
			}
		}
	}
}