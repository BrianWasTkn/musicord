import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'leave',
	aliases: ['leavechannel'],
	description: 'leave your voice channel.',
	usage: 'command'
}, async (bot, message) => {
	try {
		/** Voice Channel of <GuildMember> */
		const { channel } = message.member.voice;
		/** Voice Connection of <Client> */
		const connection = bot.voice.connections.get(message.guild.id);
		/** Checks if <GuildMember>.voice.connection === <Client>.voice.connection */
		if (connection && connection.channel.id === channel.id) {
			/** Leave */
			const voice = await channel.leave();
			/** Return Message */
			return simpleEmbed({
				title: 'Channel Left',
				color: 'GREEN',
				text: `Successfully left voice channel **${voice.channel.name}**.`
			});
		} else {
			/** Stay and Return Message */
			return simpleEmbed({
				title: 'Channel Difference',
				color: 'RED',
				text: 'You\'re in a different voice channel than me.'
			});
		}
	} catch(error) {
		log('error', 'leave@main_command', error);
		return errorEmbed(message, error);
	}
})