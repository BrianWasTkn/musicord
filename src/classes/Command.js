import discord from 'discord.js'
import config from '../config.js'
import utils from './Utilities.js'

export default class Command {
	constructor(options, func) {
		/** The command function */
		this.run = func;

		/** Basic Info */
		this.usage				= options.usage === 'command' ? `${config.prefix[0]}${options.name}` : options.usage;
		this.permissions 	= ["SEND_MESSAGES"].concat(options.permissions || []);
		this.description	= options.description || 'No description provided.';
		this.cooldown			= options.cooldown || this.defaultCooldown;
		this.aliases 			= options.aliases || [options.name];
		this.music				= options.music || false;
		this.name 				= options.name;

		/** Cooldowns */
		this.defaultCooldown = 3000;
	}

	/**
	 * Process Cooldowns
	 * @param {Object} [message] the message object
	 * @param {Object} [command] the command object
	 */
	_processCooldown(message, command) {
		/** Check in the collection */
		if (!message.client.cooldowns.has(command.name)) {
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
				return {
					title: 'Cooldown',
					color: 'BLUE',
					description: `Command **${command.name}** on cooldown.\nWait ${timeLeft > 60 ? ${utils.parseTime(timeLeft)} : `${timeLeft.toFixed()} seconds`} and try again.`,
					footer: { 
						text: 'Thanks for support!'
					} 
				}
			} 
		} 
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
		const returned = await this.run(bot, message, args); // Promise
		if (!returned) {
			return;
		}
		if (returned instanceof Object) {
			const embedObj = Object.assign({ color: 'RANDOM'}, returned)
			return message.channel.send({ embed: embedObj })
		}
		if (Array.isArray(returned)) {
			return message.channel.send(returned[Math.floor(Math.random() * returned.length)])
		}
		return message.channel.send(returned)
	}

	_checkPermissions(bot, command, message) {
		/** User Permissions */
		if (!message.member.permissions.has(command.permissions)) {
			return `**Missing Permissions**\nMake sure you have the following permissions:\n\n\`${command.permissions.join('`, `')}\``
		}
	}

	_checkVoiceState(message, command) {
		if (command.music) {
			const channel = message.member.voice.channel;
			if (!channel) {
				return '**voice channel!** you\'re not in a voice channel, please join in one.'
			} else {
				const myPermissions = channel.permissionsFor(message.client.user);
				if (!myPermissions.has('CONNECT')) {
					return '**oops!** looks like i don\'t have permissions to connect in your channel...'
				}
				if (!myPermissions.has('SPEAK')) {
					return '**oh no!** I cannot `SPEAK` in your channel, make sure I have permissions to talk in your channel so I can play the track.'
				}
			}
		}
	}
}