import Discord from 'discord.js'
import config from '../config.js'

import { parseTime } from '../utils/text.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed,
	errorEmbed 
} from '../utils/embed.js'

/**
 * Creates a command class
 */

class Command {
	constructor(client, options) {

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
			this.usage = [this.bot.prefix, options.name, options.usage].join(' ');
		} else {
			this.usage = [this.bot.prefix, options.name].join(' ');
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
		this.permissions = ['SEND_MESSAGES'].concat(options.permissions || []);
	}

	/** Shortcut for logging */
	log(tag, error) {
		return log('command', tag, error);
	}

	/** Creates an Embed */
	createEmbed({ 
		author = {}, footer = {}, fields = {},
		title = null, icon = null, text = null,
		color = 'RANDOM'
	} = {}) {
		return {
			embed: {
				author: { name: author.text, iconURL: author.icon },
				title: title,
				thumbnail: icon,
				color: color,
				description: text,
				fields: Object.entries(fields).map(f => ({ name: f[0], value: f[1].content, inline: f[1].inline || false })),
				footer: { text: footer.text, iconURL: footer.icon }
			}
		}
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
				timeLeft = timeLeft > 60 ? parseTime(timeLeft) : `${timeLeft.toFixed(1)} seconds`;
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

	checkPermissions({ command, msg }) {
		if (!msg.member.permissions.has(command.permissions)) {
			return this.createEmbed({
				title: 'Missing Permissions',
				color: 'RED',
				text: 'You don\'t have enough permissions to run this command.',
				fields: {
					[`${command.permissions.length} missing permissions`]: {
						content: `\`${command.permissions.join('`, `')}\``
					}
				}
			});
		}
	}
}
