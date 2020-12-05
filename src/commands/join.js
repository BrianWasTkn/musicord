import Command from '../classes/Command.js'

/**
 * Represents a Join Command
 * @class @extends Command
 */
export default class Join extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ['bound'],
			description: 'Joins your current voice channel.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Music',
			checks: []
		});
	}

	/**
	 * Runs this command
	 * @param {Object} Options an object of parameters to use within this command
	 * @param {import'discord.js'.Message} Options.msg a discord message object
	 * @returns {Promise<void>|Promise<import'discord.js'.Message>}
	 */
	async execute({ msg }) {

		/** Voice Channel */
		const { channel } = msg.member.voice;

		/** Joinable */
		if (!channel.joinable) {
			try {
				return msg.channel.send(super.createEmbed({
					title: 'Missing Permissions',
					color: 'RED',
					text: 'Make sure I have permissions to `CONNECT` in your voice channel.'
				}));
			} catch(error) {
				super.log('join@msg', error);
			}
		}

		/** Full */
		if (channel.full) {
			try {
				return msg.channel.send(super.createEmbed({
					title: 'Channel Full',
					color: 'RED',
					text: 'Your voice channel is already full so I\'m unable to join.'
				}));
			} catch(error) {
				super.log('join@msg', error);
			}
		}

		/** Leave */
		try {
			const connection = await channel.join();
			/* Deafen */
			try {
				const { voice } = await connection.voice.setSelfDeaf(true);
				/* Message */
				try {
					await msg.channel.send(super.createEmbed({
						title: 'Channel Joined',
						color: 'RED',
						text: `Successfully join **${connection.channel.name}**.`
					}));
				} catch(error) {
					super.log('join@msg', error);
				}
			} catch {
				super.log('join@self_deafen', error);
			}
		} catch(error) {
			super.log('join', error);
		}
	}
}