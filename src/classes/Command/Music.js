import Command from '../Command.js'
import { simpleEmbed } from '../../utils/embed.js'
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

	_processVoice(message) {
		const { channel } = message.member.voice;
		if (!channel) return simpleEmbed(message, 'You need to join a voice channel first in order to use music commands.');
	}

	async execute(bot, command, message, args) {
		for (const check of [this._processVoice, this._checkPermissions]) {
			const msg = check(message);
			if (msg) return message.channel.send({ embed: msg });
		}
		return super.execute(bot, command, message, args);
	}

	_checkPermissions(message) {
		const voice = this._processVoice(message);
		if (voice) return voice;
		const { channel } = message.member.voice,
		myPermissions = channel.permissionsFor(message.client.user),
		if (!myPermissions.has('CONNECT')) return simpleEmbed(message, `Make sure I have permissions to ${Permissions.CONNECT}`);
		if (!myPermissions.has('SPEAK')) return simpleEmbed(message, `Please ensure I have the permissions to ${Permissions.SPEAK}`);
	}
}