import discord from 'discord.js'
import config from '../config.js'

/**
 * Creates a command class
 * @private
 */
class Command {
	constructor(options, func) {
		/**
		 * Command Function
		 * @type {Promise<void>}
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
		if (!message.client.cooldowns.has(command.name)) 
			message.client.cooldowns.set(command.name, new discord.Collection());
		// variables
		const now = Date.now(),
		timestamps = message.client.cooldowns.get(command.name),
		cooldown = command.cooldown || command.defaultCooldown,
		check = this._checkCooldown(command, message, now, timestamps, cooldown);
		if (check) return check;
		// timeout to delete cooldown
		timestamps.set(message.author.id, now)
		setTimeout(() => {
			message.client.cooldowns.delete(message.author.id)
		}, command.cooldown);
	}

	/**
	 * Check Cooldowns
	 * @param {Object} [command] the message object
	 * @param {Object} [message] the command object
	 * @param {Number} [now] the date now
	 * @param {discord.Collection} [timestamps] the collection of timestamps
	 * @param {Number} [cooldown] the cooldown of the command
	 * @returns {Object} [embed.Object] the embed object
	 */
	_checkCooldown(command, message, now, timestamps, cooldown) {
		if (timestamps.has(message.author.id)) {
			const expiration = timestamps.get(message.author.id) + cooldown;
			if (now < expiration) {
				const timeLeft = (expiration - now) / 1000;
				return {
					title: 'Cooldown',
					color: 'BLUE',
					description: `Command \`${command.name}\` on cooldown.\nWait **${timeLeft > 60 ? message.client.utils.parseTime(timeLeft) : `${timeLeft.toFixed(1)} seconds`}** and try again.`,
					footer: { text: 'Thanks for support!' } 
				}
			} 
		} 
	}

	async execute(bot, command, message, args) {
		// Process Cooldown 
		const cooldown = this._processCooldown(message, command);
		if (cooldown) return message.channel.send({ embed: cooldown});
		// Check Permissions
		const permission = this._checkPermissions(message, command);
		if (permission) return message.channel.send({ embed: permission });

		// Run
		const returned = await this.run(bot, message, args); // Promise
		if (!returned) return;
		if (returned instanceof Object) {
			const embedObj = Object.assign({ color: 'RANDOM', footer: { text: `Thanks for using ${bot.user.tag}!` } }, returned);
			return message.channel.send({ embed: embedObj });
		}
		return message.channel.send(returned);
	}

	_checkPermissions(message, command) {
		// User Permissions
		if (!message.member.permissions.has(command.permissions)) {
			return {
				title: 'Missing Permissions',
				color: 'RED',
				description: 'You don\'t have enough permissions to run this command!',
				fields: [
					{ name: `\`${command.permissions.length}\` missing ${command.permissions.length > 1 ? 'permissions' : 'permission'}`, value: `\`${command.permissions.join('`, `')}\`` }
				]
			}
		}
	}
}

export default Command;