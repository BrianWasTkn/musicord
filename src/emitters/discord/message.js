import Listener from '../classes/Listener.js'

export default class Message extends Listener {
	constructor(client) {
		super(client);
	}

	async run(msg) {
		if (msg.channel.type !== 'dm' && !msg.author.bot) {
			try {
				/** Bot Prefix */
				if (!msg.content.startsWith(this.client.prefix)) {
					return;
				}
				
				/** Commands/Args */
				const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);
				const command = this.client.commands.get(cmd.toLowerCase()) || this.client.aliases.get(cmd.toLowerCase());
				if (!command) return;

				/** Permissions and Cooldown */
				for (const check of [command.handleCooldown, command.checkPermissions]) {
					return msg.channel.send(check({ Bot: this.client, msg, args}));
				}

				/** Run */
				try { 
					await command.execute({ Bot: this.client, msg, args }); 
				} catch(error) { 
					super.log('Message@exec_cmd', error);
				}
			} catch(error) {
				super.log('Message@fetch_cmd', error);
			}
		}
	}
}