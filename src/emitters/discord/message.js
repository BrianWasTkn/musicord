import Listener from '../../classes/Listener.js'

export default class Message extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		client.on('message', this.handle);
	}

	async handle(msg) {
		if (msg.channel.type !== 'dm' && !msg.author.bot) {
			try {
				/** Bot Prefix */
				if (!msg.content.startsWith(this.client.prefix)) {
					return;
				}
				
				/** Commands/Args */
				const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);
				const command = this.client.commands.get(cmd) || this.client.aliases.get(cmd);
				if (!command) return;

				/** Permissions and Cooldown */
				for (const check of [command.handleCooldown, command.checkPermissions]) {
					return msg.channel.send(check({ Bot: this.client, msg, args }));
				}

				/* Command Checks */
				// Server Queue
				if (command.checks.includes('queue')) {
					try {
						const queue = Bot.distube.getQueue(msg);
						if (!queue) {
							return msg.channel.send(super.createEmbed({
								title: 'Player Empty',
								color: 'RED',
								text: 'There\'s nothing in the queue, playing or queued right now.',
							}));
						}
					} catch(error) {
						super.log('Message@fetch_queue', error);
					}
				} 

				// Voice Channel
				if (command.checks.includes('voice')) {
					try {
						const channel = msg.member.voice.channel;
						if (!channel) {
							/* !<VoiceChannel> */
							return msg.channel.send(super.createEmbed({
								title: 'Voice Channel',
								color: 'RED',
								text: 'You need to join a voice channel first before using this command!'
							}));
						} else {
							/* <Client> connection on <Guild> */
							const connection = this.client.voice.connections.get(msg.guild.id);
							if (connection.id !== channel.id) {
								return msg.channel.send(super.createEmbed({
									title: 'Different Channel',
									color: 'RED',
									text: 'You\'re in a different voice channel than me.'
								}));
							}
						}
					} catch(error) {
						super.log('Message@fetch_author_voice', error);
					}
				} 

				// DJ Role
				if (command.checks.includes('dj')) {
					try {
						const role = msg.member._roles.find(r => r.name === 'DJ');
						if (!role) {
							return msg.channel.send(super.createEmbed({
								title: 'Limited Usage',
								color: 'RED',
								text: `You need to have the **${role.name}** role to use this command.`
							}));
						}
					} catch(error) {
						super.log('Message@fetch_dj_role_in_member', error);
					}
				}

				/** Run */
				try { 
					await command.execute({ Bot: this.client, command, msg, args }); 
				} catch(error) { 
					super.log('Message@exec_cmd', error);
				}
			} catch(error) {
				super.log('Message@fetch_cmd', error);
			}
		}
	}
}