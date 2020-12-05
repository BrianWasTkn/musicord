import Listener from '../../classes/Listener.js'

export default class Message extends Listener {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.MESSAGE_CREATE, this.handle);
	}

	check(Bot, msg, command) {
		/* Types of checks */
		const checks = ['queue', 'dj', 'voice'];

		/* Voice */
		if (command.checks.includes(checks[2])) {
			// VC Of author
			const { channel } = msg.member.voice;
			// Check
			if (!channel) {
				// Return
				return super.createEmbed({
					title: 'Voice Channel',
					color: 'RED',
					text: `You need to join a voice channel first before using the \`${command.name}\` command.`,
					footer: {
						text: `Thanks for using ${Bot.user.username}!`,
						icon: Bot.user.avatarURL()
					}
				})
			} else {
				// Connection
				const connection = this.client.voice.connections.get(msg.guild.id);
				// Check
				if (connection.id !== channel.id) {
					// Return
					return super.createEmbed({
						title: 'Channel Difference',
						color: 'RED',
						text: 'You\'re in a different channel than I am. Please ensure I\'m in the same channel as yours, and try again.'
					});
				}
			}
		}

		/* DJ */
		if (command.checks.includes(checks[1])) {
			// Role
			const role = msg.member._roles.find(r => r.name === 'DJ');
			// Check
			if (!role) {
				// Return
				return super.createEmbed({
					title: 'Limited Usage',
					color: 'RED',
					text: `You need to have the **${role.name}** role before using this command.`,
					footer: {
						text: `Thanks for using ${Bot.user.username}!`,
						icon: Bot.user.avatarURL()
					}
				})
			}
		}

		/* Queue */
		if (command.checks.includes(checks[0])) {
			// Fetch
			const queue = Bot.distube.getQueue(msg);
			// Check
			if (!queue) {
				// Return
				return super.createEmbed({
					title: 'Player Empty',
					color: 'RED',
					text: 'There\'s nothing playing in the queue right now.',
					footer: {
						text: `Thanks for using ${Bot.user.username}!`,
						icon: Bot.user.avatarURL()
					}
				});
			}
		}
	}

	async handle(msg) {
		/* Ignore Bots */
		if (msg.author.bot) return;

		/* Args */
		let [cmd, ...args] = msg.content.slice(this.client.prefix.length).trim().split(/ +/g);
		const command = this.client.commands.get(cmd) || this.client.alaises.get(cmd);
		if (!command) return;

		/* Dev Command: execute any (any channel, any permissions) */
		if (this.client.developers.includes(msg.author.id)) {
			try {
				/* Run */
				await command.execute({ 
					Bot: this.client,
					msg, args 
				});
			} catch(error) {
				/* Error */
				await msg.channel.send(error.message);
				super.log('Message@execute', error);
			}
		} else {
			/* Every non-dm channel */
			if (msg.channel.type !== 'dm') {
				/* Non-dev command */
				if (command.category === 'Developer') {
					return;
				}

				/* Cooldown/Perms */
				for (let check of [command.handleCooldown, command.checkPermissions]) {
					check = await check({ Bot: this.client, msg, args });
					if (check) {
						return msg.channel.send(check);
					}
				}

				/* Command Checks */
				for (const check of ['voice', 'dj', 'queue']) {
					if (command.checks.includes(check)) {
						const ret = this.check(Bot, msg, command);
						if (ret) {
							return msg.channel.send(ret);
						}
					}
				}

				/* Run */
				try { 
					await command.execute({ Bot: this.client, command, msg, args }); 
				} catch(error) { 
					super.log('Message@exec_cmd', error);
				}
			}
		}
	}
}