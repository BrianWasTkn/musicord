import Discord from 'discord.js'

/**
 * Creates a command class
 */

export default class Command {
	constructor(client, options, extension) {

		/**
		 * Discord Client
		 * @type {Discord.Client}
		 */
		this.client = client;

		/**
		 * Command Name
		 * @type {String|RegExP}
		 */
		this.name = options.name;

		/** 
		 * Command Description
		 * @type {String}
		 */
		this.description = options.description;

		/**
		 * Command Aliases
		 * @type {String[]}
		 */
		this.aliases = options.aliases || [label];

		/**
		 * Command Usage
		 * @type {String}
		 */
		if ('usage' in options) {
			if (options.usage === 'command') {
				this.usage = [`${client.prefix}${options.name}`].join(' ');
			} else {
				this.usage = [`${client.prefix}${options.name}`, options.usage].join(' ');
			}
		} else {
			this.usage = [`${client.prefix}${options.name}`].join(' ');
		}

		/**
		 * Command Cooldown
		 * @type {Number}
		 */
		this.cooldown = options.cooldown || 3000;

		/**
		 * Command Required Permissions
		 * @type {String[]}
		 */
		if ('permissions' in options && options.permissions.length > 1) {
			this.permissions = ['SEND_MESSAGES'].concat(options.permissions);
		} else {
			this.permissions = ['SEND_MESSAGES'];
		}

		/**
		 * Command Category 
		 * @type {String}
		 */
		this.category = extension.category;

		/**
		 * Custom Checking
		 * * `dj` - dj role
		 * * `voice` - if member in voice channel
		 * * `queue` - if queue is present
		 * @type {String[]}
		 */
		this.checks = extension.checks || [];
	}

	/** Shortcut for logging */
	log(msg, error) {
		return this.client.utils.log('Command', 'error', msg, error);
	}

	/** Creates an Embed */
	createEmbed({
		author = {}, fields = {}, footer = {},
		title = null, icon = null, text = null,
		color = 'RANDOM'
	} = {}) {
		return this.client.utils.dynamicEmbed({
			author, fields, footer,
			title, text, icon, color
		});
	}

	handleCooldown({ Bot, command, msg }) {
		/** Check if on cooldown collection */
		if (!Bot.cooldowns.has(command.name)) {
			Bot.cooldowns.set(command.name, new Discord.Collection());
		}

		/** Variables */
		const now = Date.now();
		const timestamps = Bot.cooldowns.get(command.name);
		const cooldown = command.cooldown;

		/** Check */
		if (timestamps.has(msg.author.id)) {
			const expiration = timestamps.get(msg.author.id) + cooldown;
			// On cooldown
			if (now < expiration) {
				let timeLeft = (expiration - now) / 1000;
				timeLeft = timeLeft > 60 
				? this.client.utils.formatCooldown(timeLeft * 1000) 
					: `${timeLeft.toFixed(1)} seconds`;
				// Return a message
				return this.createEmbed({
					title: 'Cooldown, Slow down.',
					color: 'BLUE',
					text: `You\'re currently on cooldown for command \`${command.name}\`. Wait **${timeLeft}** and try running the command again.`,
					footer: {
						text: `Thanks for using ${Bot.user.username}!`,
						icon: Bot.user.avatarURL()
					}
				})
			} 
		} 
		// timeout to delete cooldown
		timestamps.set(msg.author.id, now)
		setTimeout(() => {
			Bot.cooldowns.delete(msg.author.id)
		}, command.cooldown);
	}

	checkPermissions({ Bot, command, msg }) {
		if (!msg.member.permissions.has(command.permissions)) {
			return this.createEmbed({
				title: 'Missing Permissions',
				color: 'RED',
				text: 'You don\'t have enough permissions to run this command.',
				fields: {
					[`${command.permissions.length} missing permissions`]: {
						content: `\`${command.permissions.join('`, `')}\``
					}
				},
				footer: {
					text: `Thanks for using ${Bot.user.username}!`,
					icon: Bot.user.avatarURL()
				}
			});
		}
	}
}
