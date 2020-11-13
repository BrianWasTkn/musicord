import discord from 'discord.js'

export default class Command {
	constructor(options, func) {
		/** The command function */
		this.run = func;

		/** Basic Info */
		this.usage				= options.usage === 'command' ? this.name : options.usage;
		this.permissions 	= ["SEND_MESSAGES"].concat(options.permissions || []);
		this.aliases 			= [options.name].concat(options.aliases || []);
		this.description	= options.description || 'No description provided.';
		this.cooldown			= options.cooldown || this.defaultCooldown;
		this.music				= options.music || false;
		this.name 				= options.name;

		/** Cooldowns */
		this.defaultCooldown = 3000;
		this.cooldowns = new discord.Collection();
	}

	/**
	 * Process Cooldowns
	 * @param {Object} [message] the message object
	 * @param {Object} [command] the command object
	 */
	_processCooldown(message, command) {
		/** Check in the collection */
		if (!command.cooldowns.has(command.name)) {
			message.client.cooldowns.set(command.name, new discord.Collection());
		}

		/** Pre-Variables */
		const now = Date.now();
		const timestamps = message.client.cooldowns.get(command.name);
		const cooldown = command.cooldown || command.defaultCooldown;

		/** Check if on cooldown */
		const check = this._checkCooldown(command, message, now, timestamps, cooldown);
		if (check) {
			/** Return Cooldown Message */
			return check;
		}

		/** Process Cooldown */
		timestamps.set(message.author.id, now)
		setTimeout(() => {
			message.client.cooldowns.delete(message.author.id)
		}, command.cooldown);
	}

	_checkCooldown(command, message, now, timestamps, cooldown) {
		if (timestamps.has(message.author.id)) {
			const expiration = timestamps.get(message.author.id) + cooldown;

			if (now < expiration) {
				const timeLeft = (expiration - now) / 1000;
				return `please wait **${timeLeft.toFixed(1)}** seconds before re-using the \`${comamnd.name}\` command.`
			} 
			return false;
		} 
		return false;
	}

	async execute(bot, command, message, args) {
		/** Process Cooldown */
		const cooldown = this._processCooldown(message, command);
		if (cooldown) {
			return message.reply(cooldown);
		}

		/** Check Permissions */
		const permission = this._checkPermissions(bot, command, message);
		if (permission) {
			return message.reply(permission);
		}

		/** Process VoiceState */
		const state = this._checkVoiceState(message, command);
		if (state) {
			return message.reply(state)
		}

		/** Else, Run it */
		const returned = this.run(bot, message, args);
		if (returned) {
			if (returned instanceof Object) {
				return message.channel.send({ embed: returned })
			}
			if (Array.isArray(returned)) {
				return message.channel.send(returned[Math.floor(Math.random() * returned.length)])
			}
			return message.channel.send(returned)
		}
	}

	_checkPermissions(bot, command, message) {
		/** User Permissions */
		if (!message.member.permissions.has(command.permissions)) {
			return `**Missing Permissions**\nMake sure you have the following permissions:\n\n\`${command.permissions.join('`, `')}\``
		}

		return false;
	}

	_checkVoiceState(message, command) {
		if (command.music) {
			const channel = message.member.voice.channel;
			if (!channel) {
				return '**voice channel!** you\'re not in a voice channel, please join in one.'
			} else {
				const myPermissions = channel.permissionsFor(bot.user);
				if (!myPermissions.has('CONNECT')) {
					return '**oops!** looks like i don\'t have permissions to connect in your channel...'
				}
				if (!myPermissions.has('SPEAK')) {
					return '**oh no!** I cannot `SPEAK` in your channel, make sure I have permissions to talk in your channel so I can play the track.'
				}
			}
		} else {
			return false;
		}
	}
}