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

	async handle({ Bot, msg }) {
		const { author, channel, guild, member } = msg;

		/* Author is bot || content doesnt start with prefix */
		if (author.bot || !msg.content.startsWith(Bot.prefix)) return;
		/* Blacklisted user */
		if (Bot.blacklists.includes(author.id)) return;
		/* Command and Args */
		let [cmd, ...args] = msg.content.slice(Bot.prefix.length).trim().split(/ +/g);
		const command = Bot.commands.get(cmd) || Bot.aliases.get(cmd);


		/* Dev command */
		if (Bot.developers.includes(author.id)) {
			try {
				return await command.execute({ Bot, msg, args });
			} catch(error) {
				super.log('CommandManager@exec_dev_command', error);
				await channel.send({
					content: `Error\n${error.message}`,
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
			const perms = command.checkPermissions;
			if (cooldown) {
				return msg.reply(`Command \`${command.name}\` on cooldown for you, wait **${cooldown}** and try again.`);
			}

			/* Permissions */
			if (perms) {
				const { type, permissions } = perms;
				if (type === 'user') {
					return channel.send([
						'**Missing Permissions**',
						'Looks like you don\'t have permissions to run this command, shame.',
						'Please ensure you have the following permissions:',
						`\`${permissions.join('`, `')}\``
					].join('\n'));
				} else if (type === 'client') {
					return channel.send([
						'**Missing Permissions**',
						'I don\'t have enough permissions to run this command for you.',
						'Make sure I have each of the following permissions:',
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
				if (!member._roles.has(role)) {
					return channel.send('You have limited permissions to use this command.\nYou need to have the "DJ" role in order to use this.')
				}
			}

			/* Args */
			if (args.length < 1 && command.argsRequired) {
				/* Check if command has expectedArguments */
				/* And if args.length is less than the length of command.usage split by space */
				if (command.expectedArgs && (args.length < command.usage.split(' ').length)) {
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