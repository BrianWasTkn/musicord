import Command from '../../classes/Command'

/**
 * Representing a Leave Command
 * @class @extends Command
 */
export default class Leave extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['unbound'],
			description: 'Musicord leaves your voice channel.',
			usage: '[timeout]',
			cooldown: 5000
		}, {
			category: 'Music',
			user_permissions: [],
			client_permissions: ['EMBED_LINKS'],
			music_checks: [],
			args_required: false
		});
	}

	/**
	 * Executes this command
	 * @param {Object} Options an object of parameters to use within this command
	 * @param {import'../classes/Musicord'} Options.Bot A Musicord client
	 * @param {import'discord.js'.Message} Options.msg A Discord.Message class
	 */
	async execute({ Bot, msg }) {
		try {
			/** Voice Channel of <GuildMember> */
			const { channel } = msg.member.voice;
			/** Voice Connection of <Client> */
			const connection = Bot.voice.connections.get(msg.guild.id);
			/** Checks if <GuildMember>.voice.connection === <Client>.voice.connection */
			if (connection && connection.channel.id === channel.id) {
				/** Leave */
				const voice = channel.leave();
				/** Return Message */
				await msg.channel.send(super.createEmbed({
					title: 'Channel Left',
					color: 'GREEN',
					text: `Successfully left voice channel **${voice.channel.name}**.`
				}));
			} else if (connection.channel.id !== channel.id) {
				/** Stay and Return Message */
				await msg.channel.send(super.createEmbed({
					title: 'Channel Difference',
					color: 'RED',
					text: 'You\'re in a different voice channel than me.'
				}));
			} else if (!connection) {
				/** No connecion, return msg */
				await msg.channel.send(super.createEmbed({
					title: 'Voice Channel',
					color: 'RED',
					text: 'You\'re not in a voice channel for me to leave.'
				}));
			}
		} catch(error) {
			super.log('leave', error);
		}
	}
}