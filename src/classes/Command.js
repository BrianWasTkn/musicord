import Discord from 'discord.js'

/**
 * Creates a command class
 * @class @exports Command 
 */
export default class Command {
	constructor(client, props, propsExt) {
		/* Command Ratelimits */
		Object.defineProperty(this, '_rateLimits', { 
			value: new Discord.Collection() 
		});

		/* {Discord.Client} Discord Client (Musicord) */
		this.client = client;
		/* {String} Command Name */
		this.name = props.name;
		/* {String[]} Array of command triggers */
		this.aliases = props.aliases || props.triggers || [props.name];
		/* {String} Command Description */
		this.description = props.description;
		/* {String} Command Usage*/
		this.usage = options.usage 
		? [`${client.prefix}${props.name}`, props.usage].join(' ') 
			: `${client.prefix}${props.name}`;
		/* {Number} Command Cooldown */
		this.cooldown = props.cooldown || 5000;
		/* {Number} How many times the user can run this command within the cooldown */
		this.rateLimit = props.rate_limit || 1;

		/* {String} Command Category */
		this.category = extension.category;
		/* {PermissionString[]} Required Permissions to run */
		this.permissions = ['SEND_MESSAGES'].concat(extension.user_permissions || []);
		/* {PermissionString[]} Required Client permissions to run */
		this.clientPermissions = ['SEND_MESSAGES', 'EMBED_LINKS'].concat(extension.client_permissions || []);
		/* {String[]} `dj`, `voice`, or `queue` */
		this.checks = extension.music_checks || [];
		/* {String} Expected arguments */
		this.expected_args = props.usage === 'command' ? null : props.usage;

		/* {Boolean} Owner-Only */
		this.ownerOnly = Boolean(extension.owner_only) || false;
		/* {Boolean} Guild-only */
		this.guildOnly = Boolean(extension.guild_only) || true;
		/* {Number} Global limited uses */
		this.uses = extension.limited_usage || Infinity;
	}

	/**
	 * A shortcut for logging
	 * @param {String} msg the tag of the command
	 * @param {Error} error an object of an error
	 */
	log(msg, error) {
		return this.client.utils.log('Command', 'error', msg, error);
	}

	/**
	 * An alternative for a Discord.MessageEmbed
	 * @param {Object} Options An object of re-structured Discord.Embed
	 */
	createEmbed({
		author = {}, fields = {}, footer = {},
		title = null, icon = null, text = null,
		color = 'RANDOM', timestamp = Date.now()
	} = {}) {
		return this.client.utils.dynamicEmbed({
			author, fields, footer,
			title, text, icon, color,
			timestamp
		});
	}

	handleCooldown({ Bot, command, msg }) {
		/* Ratelimits */
		Bot.ratelimits = new Discord.Collection();
		/* Handle */
		if (command.rateLimit > 1) {
			const cmdRateLimits = Bot.ratelimits.set(command.name, new Discord.Collection());
			const cmd = Bot.ratelimits.get(command.name);
		}
	}

	/**
	 * Handles the cooldown for each user using this command.
	 * @param {Object} Options an object of parameters
	 * @param {Discord.Client} Options.Bot The discord client
	 * @param {Command} Options.command This command
	 * @param {Discord.Message} Options.msg The discord message
	 * @returns {Discord.MessageEmbed|null} An embed, if any
	 */
	handleCooldown({ Bot, command, msg }) {
		/* Destructure */
		const { name, cooldown } = command;
		const { cooldowns, user, utils } = Bot;
		/** Check if on cooldown collection */
		if (!cooldowns.has(name)) {
			cooldowns.set(name, new Discord.Collection());
		}

		/** Variables */
		const now = Date.now();
		const timestamps = cooldowns.get(name);
		const cd = cooldown;

		/** Check */
		if (timestamps.has(msg.author.id)) {
			const expiration = timestamps.get(msg.author.id) + cd;
			// On cooldown
			if (now < expiration) {
				let timeLeft = (expiration - now) / 1000;
				timeLeft = timeLeft > 60 
				? utils.formatCooldown(timeLeft * 1000) 
					: `${timeLeft.toFixed(1)} seconds`;
				// Return a message
				return this.createEmbed({
					title: 'On cooldown, slow down.',
					color: 'INDIGO',
					text: `You're currently on cooldown for command \`${name}\`. Wait **${timeLeft}** and try again.`,
					footer: {
						text: `Thanks for using ${user.username}!`,
						icon: user.avatarURL()
					}
				});
			} 
		} 
		// timeout to delete cooldown
		timestamps.set(msg.author.id, now)
		setTimeout(() => {
			Bot.cooldowns.delete(msg.author.id)
		}, cooldown);
	}

	/**
	 * Checks if the member has the right permissions to run this command.
	 * @param {Object} Options an object of parameters
	 * @param {Discord.Client} Options.Bot The discord client
	 * @param {Command} Options.command This command
	 * @param {Discord.Message} Options.msg The discord message
	 * @returns {Discord.MessageEmbed|null} An embed, if any
	 */
	checkPermissions({ Bot, command, msg }) {
		const { permissions } = command;
		if (!msg.member.permissions.has(permissions)) {
			return this.createEmbed({
				title: 'Missing Permissions',
				color: 'RED',
				text: 'You don\'t have enough permissions to run this command.',
				fields: {
					[`${permissions.length} missing permissions`]: {
						content: `\`${permissions.join('`, `')}\``
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
