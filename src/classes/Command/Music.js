import Command from '../Command.js'

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
		const { channel } = message.member.voice,
		isPlaying = message.client.player.getQueue(message);
		if (!channel && isPlaying) {
			return {
				title: 'Voice Channel',
				color: 'BLUE',
				description: 'You need to join a voice channel first in order to use music commands.\nPlease join in one and try running the command again.',
				footer: { text: `Thanks for using ${bot.user.username}!` }
			}
		}
	}

	async execute(bot, command, message, args) {
		const voice = this._processVoice(message);
		if (voice) return message.channel.send({ embed: voice });
		const perms = this._checkPermissions(message);
		if (perms) return message.channel.send({ embed: perms });

		return super.execute(bot, command, message, args);
	}

	_checkPermissions(message) {
		const voice = this._processVoice(message);
		if (voice) return voice;
		const { channel } = message.member.voice;
		const myPermissions = channel.permissionsFor(message.client.user);
		const embedify = (content) => {
			return {
				title: 'Missing Permissions',
				color: 'RED',
				description: content,
				footer: { text: `Thanks for using ${message.client.user.username}!` }
			}
		}
		if (!myPermissions.has('CONNECT')) {
			return embedify('Please make sure I have permissions to `CONNECT` so I can join in your voice channel.')
		}
		if (!myPermissions.has('SPEAK')) {
			return embedify(`Please make sure I have permissions to \`SPEAK\` so I could play the track you wish.\nTry modifying **${channel.name}**'s channel permissions.`)
		}
	}
}