import Manager from '../classes/Manager.js'
const { Constants: Events } = require('discord.js');

export default class CommandManager extends Manager {
	constructor(client) {
		super(client);
		/* Handle */
		client.on(Events.MESSAGE_CREATE, async message => await this.handle({ 
			Bot: this.client, msg: message 
		}));
	}

	async handle({ Bot, msg }) {
		if (msg.channel.type !== 'dm' && !msg.author.bot) {
			/* Bot Prefix */
			if (!msg.content.startsWith(Bot.prefix)) return;

			/* Args */
			const args = msg.content.slice(Bot.prefix).trim().split(/ +/g);
			const cmd = args.shift().toLowerCase();
			const command = Bot.commands.get(cmd) || Bot.aliases.get(cmd);

			/* test */
			if (cmd === 'test') {
				await msg.channel.send('from cmd manager');
			}
		}
	}
}