import Command from '../../classes/Command.js'

export default class Help extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['cmd', 'command'],
			description: 'Fetch some info about a command or category',
			usage: '[command | category]',
			cooldown: 3000
		}, {
			category: 'Utility'
		});
	}

	filter(category) {
		return this.client.commands
		.filter(command => command.category === category);
	}

	/* Command Formatter */
	formatCommand({ Bot, command }) {

		/* Structure */
		let struc = [
			{ title: 'Description', value: command.description },
			{ title: 'Triggers',		value: `\`${command.aliases.join('`, `')}\`` },
			{ title: 'Usage',				value: `\`${command.usage}\`` },
			{ title: 'Cooldown',		value: command.cooldown },
			{ title: 'Category',		value: command.category },
			{ title: 'Dependencies',value: command.checks.join('`, `') || 'none' }
		];

		/* Iterator */
		const obj = {};
		struc.map((f, i) => {
			obj[`${f[i].title} Commands`] = {
				content: `\`${f[i].commands.join('`, `')}\``
			}
		});

		/* Message */
		return super.createEmbed({
			title: `${Bot.prefix}${command.name}`,
			color: 'BLUE',
			fields: obj,
			footer: {
				text: `Thanks for using ${Bot.user.username}!`,
				icon: Bot.user.avatarURL()
			}
		})
	}

	/* Category Formatter */
	formatCategory({ Bot, category }) {
		/* Return */
		return super.createEmbed({
			title: Bot.user.username,
			color: 'BLUE',
			text: Bot.package.description,
			fields: {
				[`${category.charAt(0).toUpperCase() + category.slice(1)} Commands`]: {
					content: `\`${Bot.commands.filter(c => c.category.toLowerCase() === category)}\``
				}
			},
			footer: {
				text: `Thanks for using ${Bot.user.username}!`,
				icon: Bot.user.avatarURL()
			}
		});
	}

	/* All */
	formatHelp({ Bot, alignment }) {

		/* Iterator */
		const obj = {};
		struc.map((f, i) => {
			obj[`${f[i].title} Commands`] = {
				content: `\`${f[i].commands.join('`, `')}\``
			}
		});

		/* Return */
		return super.createEmbed({
			title: Bot.user.username,
			color: 'BLUE',
			text: Bot.package.description,
			fields: obj,
			footer: {
				text: `Thanks for using ${Bot.user.username}!`,
				icon: Bot.user.avatarURL()
			}
		});

	}

	async execute({ Bot, msg, args }) {
		/* Args */
		const [query] = args;
		const command = query ? (Bot.commands.get(query) || Bot.aliases.get(query)) : false;
		const category = query && !command ? Bot.commands.filter(c => c.category.toLowerCase() === query.toLowerCase()) : false;

		/* Vars */
		const alignment = [
			{ name: 'Developer', commands: this.filter('Developer') },
			{ name: 'Utility', commands: this.filter('Utility') },
			{ name: 'Music Effect', commands: this.filter('Effects') }
		];

		/* Command Search */
		if (command) {
			/* Dev Command */
			if (command.category === 'Developer') {
				if (Bot.developers.includes(msg.author.id)) {
					try {
						return msg.channel.send(this.formatCommand({ Bot, command }));
					} catch(error) {
						super.log('help@msg', error);
					}
				} else {
					return;
				}
			} else {
				try {
					return msg.channel.send(this.formatCommand({ Bot, command }));
				} catch(error) {
					super.log('help@msg', error);
				}
			}
		}
		/* Category */
		else if (category) {
			/* Dev Category */
			if (category === 'developer') {
				if (!Bot.developers.includes(msg.author.id)) {
					return;
				} else {
					try {
						return msg.channel.send(this.formatCategory({ Bot, category }));
					} catch(error) {
						super.log('help@msg', error);
					}
				}
			}
			/* Normie */
			else {
				try {
					return msg.channel.send(this.formatCategory({ Bot, category }));
				} catch(error) {
					super.log('help@msg', error);
				}
			}
		}
		/* CommandNotFound - totally not a georgenotfound reference */
		else if (!category && !command) {
			try {
				return msg.channel.send(`No command/category found for "${query}"`)
			} catch(error) {
				super.log('help@msg', error);
			}
		}
		/* All */
		else {
			/* Dev */
			if (!Bot.developers.includes(msg.author.id)) {
				try {
					return msg.channel.send(this.formatHelp({ Bot, alignment }));
				} catch(error) {
					super.log('help@msg', error);
				}
			} else {
				try {
					return msg.channel.send(this.formatDevHelp({ Bot, alignment }));
				} catch(error) {
					super.log('help@msg', error);
				}
			}
		}
	}
}