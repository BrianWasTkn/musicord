import Manager from '../classes/Manager.js'

export default class CommandManager extends Manager {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.MESSAGE_CREATE, async message => await this.handle({ 
			Bot: client, msg: message 
		}));
	}

	processCommandChecks(Bot, msg, command) {
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
				});
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

	codeBlock(str, syntax) {
		str = require('util').inspect(str, { depth: 1 });
		return `\`\`\`${syntax}\n${str}\n\`\`\``;
	}

	async handle({ Bot, msg }) {
		const {
			author, channel, guild, member
		} = msg;

		// msg.content-based checks
		if (
			author.bot || !msg.content.startsWith(Bot.prefix)
			|| Bot.blacklists.includes(author.id)
		) return;
		let [cmd, ...args] = msg.content.slice(Bot.prefix.length).trim().split(/ +/g);
		const command = Bot.commands.get(cmd) || Bot.aliases.get(cmd);


		// Developer command
		if (Bot.developers.includes(author.id)) {
			try {
				return await command.execute({ Bot, msg, args });
			} catch(error) {
				await msg.channel.send(`**Error:** ${error.message}`);
				super.log('CommandManager@exec_dev_command', error);
			}
		}

		// Normie command
		if (channel.type !== 'dm') {
			// dev cmd
			if (command.category === 'Developer' || command.ownerOnly) {
				return msg.channel.send('how dis command work?');
			};

			// check cooldown and perms
			for (let check of [command.handleCooldown, command.checkPermissions]) {
				let embed = await check({ Bot, command, msg });
				if (embed) {
					return await msg.channel.send(embed);
				}
			}

			// command checks
			for (const check of ['voice', 'queue', 'dj']) {
				const embed = this.processCommandChecks(Bot, msg, command);
				return msg.channel.send(embed);
			}

			// execute
			try {
				await command.execute({ Bot, msg, args });
			} catch(error) {
				super.log('CommandManager@exec_command', error);
				await msg.channel.send(super.createEmbed({
					title: 'Command Error',
					color: 'RED',
					text: this.codeBlock(error.message, error);
					fields: {
						'Command': {
							content: command.name,
							inline: true
						},
						'Guild': {
							content: guild ? guild.name : 'Unknown',
							inline: true,
						},
						'Channel': {
							content: channel.name,
							inline: true
						}
					}
				}));
			}
		}




		/* Ignore Bots and Messages not starting with prefix */
		if (msg.author.bot || !msg.content.startsWith(Bot.prefix)) return;

		/* Args/Command */
		let [cmd, ...args] = msg.content.slice(Bot.prefix.length).trim().split(/ +/g);
		const command = Bot.commands.get(cmd) || Bot.alaises.get(cmd);
		if (!command) return;

		if (Bot.developers.includes()) {}

		/* Dev Command: execute any (any channel, any permissions) */
		if (Bot.developers.includes(msg.author.id)) {
			try {
				/* Run */
				await command.execute({ Bot, msg, args });
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
					check = await check({ Bot: Bot, msg, args });
					if (check) {
						return msg.channel.send(check);
					}
				}

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
						/* !<VoiceChannel> */
						if (!channel) {
							return msg.channel.send(super.createEmbed({
								title: 'Voice Channel',
								color: 'RED',
								text: 'You need to join a voice channel first before using this command!'
							}));
						} else {
							/* <Client> connection on <Guild> */
							const connection = Bot.voice.connections.get(msg.guild.id);
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

				/* Run */
				try { 
					await command.execute({ Bot, msg, args }); 
				} catch(error) { 
					super.log('Message@exec_cmd', error);
				}
			}
		}
	}
}