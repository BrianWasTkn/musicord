import Command from '../classes/Command.js'
import { Collection } from 'discord.js'
import { log } from '../utils/logger.js'

class Join extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ['bound'],
			description: 'Musicord will join your voice channel.',
			usage: 'command',
			cooldown: 5000
		});

		/**
		 * Command Category 
		 * @type {String}
		 */
		this.category = 'Music';

		/**
		 * Custom Checking
		 * * `dj` - dj role
		 * * `voice` - if member in voice channel
		 * * `queue` - if queue is present
		 * * `paused` - if player paused
		 * * `stopped` - if player stopped
		 * @type {String[]}
		 */
		this.checks = [];
	}

	async execute({ msg }) {

		/** Voice Channel */
		const channel = msg.member.voice.channel;

		/** Joinable */
		if (!channel.joinable) {
			return msg.channel.send(super.createEmbed({
				title: 'Missing Permissions',
				color: 'RED',
				text: 'Make sure I have permissions to `CONNECT` in your voice channel.'
			}));
		}

		/** Full */
		if (channel.full) {
			return msg.channel.send(super.createEmbed({
				title: 'Channel Full',
				color: 'RED',
				text: 'Your voice channel is already full so I\'m unable to join.'
			}));
		}

		/** Do the thing */
		try {
			const voice = await channel.join();
			try {
				await msg.channel.send(super.createEmbed({
					title: 'Channel Joined',
					color: 'RED',
					text: `Successfully join **${voice.channel.name}**.`
				}));
			} catch(error) {
				super.log('join@msg', error);
			}
		} catch(error) {
			super.log('join', error);
		}
	}
}