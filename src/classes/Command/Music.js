import Command from '../Command.js'
import { dynamicEmbed } from '../../utils/embed.js'
import { Permissions } from '../../utils/constants.js'

export default class Music extends Command {
	constructor(options, fn) {
		super(options, fn);

		/** 
		 * Music Mode
		 * @type {Boolean}
		 */
		this.music = true;

		/**
		 * Command Category
		 * @type {String}
		 */
		this.category = 'Music';

		/**
		 * Command Cooldown
		 * @type {Number}
		 */
		this.cooldown = options.cooldown || 3000;

		/**
		 * Command Visiblity
		 * @type {Boolean}
		 */
		this.private = false;

	}

	async execute(bot, command, message, args) {
		try {
			for (const check of [this._processVoice, this._checkClientPermissions]) {
				const embed = check(message);
				if (embed) return message.channel.send(embed);
			}
			try {
				return super.execute(bot, command, message, args);
			} catch(error) {
				log('commandError', 'command@super_execute', error);
			}
		} catch(error) {
			log('commandError', 'command@check', error);
		}
	}

	_processVoice(message) {
		const { channel } = message.member.voice;
		if (!channel) {
			return dynamicEmbed({
				color: 'RED',
				author: {
					text: 'You need to join a voice channel first before using music commands.',
					icon: message.client.user.iconURL()
				}
			})
		}
	}

	_checkClientPermissions(message) {
		// Check if on Voice first
		if (this._processVoice(message)) {
			const voice = this._processVoice(message);
			return voice;
		}
		// Bot Permissions in voice.channel
		const channel = message.member.voice.channel;
		const myPermissions = channel.permissionsFor(message.client.user);
		const embedify = (msg) => dynamicEmbed({
			author: {
				text: msg,
				icon: message.client.user.avatarURL()
			}
		}) 
		if (!myPermissions.has('CONNECT')) {
			return embedify(`Make sure I have permissions to ${Permissions.CONNECT} in your voice channel.`);
		}
		if (!myPermissions.has('SPEAK')) {
			return embedify(`Please ensure I can ${Permissions.SPEAK} in your voice channel to play music.`);
		}
	}
}