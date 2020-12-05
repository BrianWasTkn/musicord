import Manager from '../classes/Manager.js'
const { Constants: Events } = require('discord.js');

export default class CommandManager extends Manager {
	constructor(client) {
		super(client);
		/* Handle */
		client.on(Events.MESSAGE_CREATE, async message => await this.handle({ 
			Bot: client, msg: message 
		}));
	}

	async handle({ Bot, msg }) {
		/* Ignore Bots and Messages not starting with prefix */
		if (msg.author.bot || !msg.content.startsWith(Bot.prefix)) return;

		/* Args/Command */
		let [cmd, ...args] = msg.content.slice(Bot.prefix.length).trim().split(/ +/g);
		const command = Bot.commands.get(cmd) || Bot.alaises.get(cmd);
		if (!command) return;

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