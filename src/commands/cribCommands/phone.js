import Command from '../../lib/structures/Command'

export default class Phone extends Command {
	constructor(client) {
		super(client, {
			name: 'phone',
			aliases: ['mail', 'dm'],
			description: 'Send a text message to someone in DMs, globally.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Crib',
			user_permissions: [],
			client_permissions: [],
			music_checks: [],
			args_required: false,
			exclusive: ['691416705917779999']
		});
	}

	async ask(msg, question) {
		/* Message */
		const embed = await msg.channel.send(msg).catch(error => super.log('phone@msg', error));
		/* Collector */
		const collector = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {
			max: 1,
			time: 30000,
			errors: ['time']
		}).catch(error => super.log('phone@collector'));
		/* Return */
		return { embed, collector };
	}

	async execute({ Bot, msg }) {
		/* Ask */
		let recipient = await this.ask(msg, super.createEmbed({
			title: 'To Whom?',
			color: 'YELLOW',
			text: 'Please provide the username, id or usertag of the recipient. This command works globally.',
			footer: {
				text: 'You have 30 seconds to reply...',
				icon: msg.author.avatarURL()
			}
		}));

		/* Check */
		if (!recipient.collector.first()) {
			return await m.edit(super.createEmbed({
				title: 'Empty User',
				color: 'RED',
				text: 'You\'re now bot banned.',
				footer: {
					text: 'Just kidding <3',
					icon: msg.author.avatarURL()
				}
			}));
		}

		/* Fetch */
		const resolveable = recipient.first();
		const user = Bot.users.cache.get(resolveable) // UserID
		|| Bot.users.cache.find(u => u.username === resolveable) // UserName
		|| Bot.users.cache.find(u => u.tag === resolveable) // UserTag
		|| resolveable.mentions.members.first() || false;

		/* Check, again */
		if (!user) {
			return await recipient.embed.edit(super.createEmbed({
				title: 'Invalid User',
				color: 'RED',
				text: 'Lol imagine sending a message to someone that doesn\'t exist, weirdo.'
			}));
		}

		/* Await Again */
		let message = await this.ask(msg, super.createEmbed({
			title: 'Message',
			color: 'GREEN',
			text: 'What\'s your message?',
			footer: {
				text: 'You have another 30 seconds.',
				icon: msg.author.avatarURL()
			}
		}));

		/* Check */
		if (!message.collector.first()) {
			return await message.embed.edit(super.createEmbed({
				title: 'No message?',
				color: 'RED',
				text: 'The next time you make me waste my 30 seconds, I\'m gonna ban you from this server okay?'
			}));
		}

		/* Fetch DM Channel */
		const dmChannel = user.dmChannel || await user.createDM();
		/* Send */
		await dmChannel.send(super.createEmbed({
			title: 'Text Message',
			color: 'BLUE',
			icon: msg.author.avatarURL(),
			text: message.collector.first().content,
			fields: {
				'From': { content: `${msg.author.tag} (${msg.author.id})`, inline: true },
				'In Server': { content: `${msg.guild.name} (${msg.guild.id})`, inline: true },
				'On': { content: Date.now(), inline: true }
			}
		})).catch(async error => {
			await msg.channel.send(`**Error:** ${error.message}`);
			super.log('phone@dm_msg', error);
		});
	}
}