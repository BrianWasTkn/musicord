import discord from 'discord.js'
import config from '../config.js'

import { dynamicEmbed as embedify } from '../utils/embed.js'
import { parseTime } from '../utils/text.js'

/**
 * Creates a command class
 * @private
 */
class Command {
	constructor(options, func) {
		/**
		 * Command Function
		 * @type {Promise<any>}
		 */
		this.run = func;

		/**
		 * Command Name
		 * @type {String}
		 */
		this.name = options.name;

		/**
		 * Command Aliases
		 * @type {Array<String>}
		 */
		this.aliases = Array.isArray(options.aliases) ? options.aliases : [options.name];

		/**
		 * Command Usage
		 * @type {String}
		 */
		this.usage = options.usage === 'command' 
		? `${config.prefix[0]}${options.name}` 
		: `${config.prefix[0]}${options.name} ${options.usage}`;

		/**
		 * Command Permissions
		 * @type {Array<PermissionResolveable>}
		 */
		this.permissions = ['SEND_MESSAGES'].concat(options.permissions || []);

		/**
		 * Command Description
		 * @type {String}
		 */
		this.description = options.description || 'No description provided.';

		/**
		 * Command Cooldown
		 * @type {Boolean}
		 */
		this.cooldown = options.cooldown || 3000;

		/**
		 * Command Visibility
		 * @type {Boolean}
		 */
		this.private = options.private || false;
	}

	/**
	 * Process Cooldowns
	 * @param {Object} [message] the message object
	 * @param {Object} [command] the command object
	 */
	_processCooldown(message, command) {
		// Check if <Member>.author.id is already in the cooldown collection
		if (!message.client.cooldowns.has(command.name)) 
			message.client.cooldowns.set(command.name, new discord.Collection());
		// The date now, timestamps, and the command cooldown
		const now = Date.now(),
		timestamps = message.client.cooldowns.get(command.name),
		cooldown = command.cooldown;
		// Check cooldown
		if (timestamps.has(message.author.id)) {
			const expiration = timestamps.get(message.author.id) + cooldown;
			// On cooldown
			if (now < expiration) {
				let timeLeft = (expiration - now) / 1000;
				timeLeft = timeLeft > 60 ? parseTime(timeLeft) : `${timeLeft.toFixed(1)} seconds`;
				// Return a message
				return embedify({
					title: 'Cooldown, Slow down.',
					color: 'BLUE',
					info: `You\'re currently on cooldown for command \`${command.name}\`. Wait **${timeLeft}** and try running the command again.`,
					footer: {
						text: `Thanks for using ${message.client.user.username}!`,
						icon: message.client.user.avatarURL()
					}
				})
			} 
		} 
		// timeout to delete cooldown
		timestamps.set(message.author.id, now)
		setTimeout(() => {
			message.client.cooldowns.delete(message.author.id)
		}, command.cooldown);
	}

	async execute(bot, command, message, args) {
		// Check cooldown and command permissions.
		const checks = [this._processCooldown, this._checkPermissions];
		for (const check of checks) {
			const ret = check(message, command);
			if (ret) return message.channel.send(ret);
		}

		// Run the command
		const returned = await this.run(bot, message, args); // Promise
		if (!returned) return;
		// An embed Object
		if (returned instanceof Object) {
			const embed = Object.assign(embedify({
				color: 'RANDOM',
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}, returned));
			return message.channel.send(embed);
		} else {
			// A string
			return message.channel.send(returned);
		}
	}

	_checkPermissions(message, command) {
		// User Permissions
		if (!message.member.permissions.has(command.permissions)) {
			return embedify({
				title: 'Missing Permissions',
				color: 'RED',
				info: 'You do not have enough permissions to run this command!',
				fields: {
					'Permissions': `**${command.permissions.length}** - \`${command.permissions.join('`, `')}\``
				},
				footer: {
					text: `Thanks for using ${message.client.user.username}!`,
					icon: message.client.user.avatarURL()
				}
			})
		}
	}
}

export default Command;