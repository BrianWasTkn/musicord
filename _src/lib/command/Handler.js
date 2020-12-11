import Manager from '../structures/Manager.js'

export class CommandHandler extends Manager {
	constructor(client) {
		super(client);
		client.on('message', this.handle.bind(null, client));
	}

	async handle(Bot, msg) {
		const { author, member, guild, channel } = msg;

		if (Bot.blacklists.includes(author.id)) return;
		if (author.bot || !msg.content.toLowerCase().startsWith(Bot.prefix)) return;

		const args = msg.content.slice(Bot.prefix.length).trim().split(/ +/g);
		const cmd = args.shift().toLowerCase();
		const command = Bot.commands.get(cmd) || Bot.commands.get(Bot.aliases.get(cmd));

		if (Bot.devMode) {
			if (!Bot.developers.includes(author.id)) {
				return await channel.send([
					'**Developer Mode**',
					`**${Bot.user.username}** is on developer mode. Bugs are being patched,`,
					'issues are being looked for and some bot features are being added and removed.'
				].join(' '));
			} else {
				return command.execute({ Bot, msg, args }).then(async () => {
					try {
						await channel.send(`Command **${command.name}** executed.`);
					} catch(error) {
						super.log('CommandHandler@dev:send_msg', error);
					}
				}).catch(async error => {
					await channel.send(`**Error:** ${error.message}`);
					return super.log('CommandHandler@dev:exec_cmd', error);
				});
			}
		}

		if (channel.type !== 'dm') {
			if (command.category === 'Developer') return;
			const cdMessage = command.handleCooldown({ Bot, command, msg });
			if (cdMessage) return channel.send(cdMessage);

			let perms = command.checkPermissions({ Bot, command, msg })
			if (perms) {
				let { type, permissions } = perms;
				const { PermissionStrings } = require('../util/Constants');
				return msg.channel.send([
					'**Missing Permissions**',
					`${type === 'user' ? 'You\'re' : 'I\'m'} missing the \`${permissions.join('`, `')}\` permissions(s).`
					`Make sure ${type === 'user' ? 'you' : 'I'} can **${PermissionStrings[permissions].join('**, **')}** and try again.`
				].join(' '));
			}
		} else {
			return await channel.send(`Command \`${command.name}\` is not available on Direct Messages.`);
		}
	}

	async handle({ Bot, msg }) {
		const { author, channel, guild, member } = msg;

		/* Author is bot || content doesnt start with prefix */
		if (author.bot || !msg.content.startsWith(Bot.prefix)) return;
		/* Blacklisted user */
		if (Bot.blacklists.includes(author.id)) {
			await channel.send('You are blacklisted from this bot.');
		}
		/* Command and Args */
		let [cmd, ...args] = msg.content.slice(Bot.prefix.length).trim().split(/ +/g);
		const command = Bot.commands.get(cmd) || Bot.aliases.get(cmd);


		/* Dev command */
		if (Bot.developers.includes(author.id)) {
			try {
				return await command.execute({ Bot, msg, args });
			} catch(error) {
				super.log('CommandManager@exec_dev_command', error);
				await channel.send(`Error\n${error.message}`, {
					code: 'js'
				});
			}
		}

		/* Non-dev command, None dm-channel */
		if (channel.type !== 'dm') {
			/* A dev-cmd */
			if (command.category === 'Developer' || command.ownerOnly) {
				return channel.send('how dis command work?');
			};

			/* Cooldown */
			const cooldown = command.handleCooldown;
			if (cooldown) {
				return msg.reply(`Command \`${command.name}\` on cooldown for you, wait **${cooldown}** and try again.`);
			}

			/* Permissions */
			const perms = command.checkPermissions;
			if (perms) {
				const { type, permissions } = perms;
				if (type === 'user') {
					return channel.send([
						'**Missing Permissions**',
						'Looks like you don\'t have permissions to run this command, shame.',
						'Please ensure you have the following permissions:\n',
						`\`${permissions.join('`, `')}\``
					].join('\n'));
				} else if (type === 'client') {
					return channel.send([
						'**Missing Permissions**',
						'I don\'t have enough permissions to run this command for you.',
						'Make sure I have each of the following permissions:\n',
						`\`${permissions.join('`, `')}\``
					].join('\n'))
				}
			}

			/* Command Checks */
			if (command.checks.includes('voice')) {
				/* Voice Channel */
				const { channel } = msg.member.voice,
					connection = Bot.voice.connections.get(guild.id);
				if (!channel) {
					return channel.send('You need to join a voice channel first.');
				} else if (connection.id !== channel.id) {
					return channel.send('Please stay in one channel only.')
				}
			} else if (command.checks.includes('queue')) {
				/* Queue */
				const queue = Bot.distube.getQueue(msg);
				if (!queue) {
					return channel.send('There\'s nothing playing in the queue.');
				}
			} else if (command.checks.includes('dj')) {
				/* DJ Role */
				const role = guild.roles.cache.find(r => r.name === 'DJ');
				if (!member._roles.has(role.id)) {
					return channel.send('You have limited permissions to use this command.\nYou need to have the "DJ" role in order to use this.')
				}
			}

			/* Args */
			if (args.length < 1 && command.argsRequired) {
				/* Check if command has expectedArguments */
				/* And if args.length is less than the length of command.usage split by space */
				if (command.expArgs && (args.length < command.usage.split(' ').length)) {
					/* Check if command has custom args message */
					const embed = command._argsMessage({ msg, args });
					/* Return message */
					if (embed) {
						return channel.send(embed);
					} else {
						return channel.send([
							'**Missing Arguments**',
							'You have missing arguments!\n',
							`**Usage:** \`${Bot.prefix}${command.usage}\``
						].join('\n'))
					}
				}
			}

			/* Exclusives */
			if (!command.exclusive.includes(guild.id)) {
				return msg.channel.send([
					'**Command Exclusive**',
					'This command is only exclusive for the following server(s):\n',
					`**${command.exclusive.map(g => Bot.guilds.cache.get(g)).map(g => g.name).join('**, **')}**`
				]);
			}

			/* Run */
			try {
				await command.execute({ Bot, msg, args });
			} catch(error) {
				super.log('CommandManager@exec_command', error);
				await Bot.config.support(Bot).errorChannel.send(super.createEmbed({
					title: 'Command Error',
					color: 'RED',
					text: this.codeBlock(error.message, error),
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
	}
}