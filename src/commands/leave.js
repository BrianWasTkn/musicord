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
		// vc of member
		const { channel } = message.member.voice;
		// connection of Discord.Musicord
		const connection = bot.voice.connections.get(message.guild.id);
		// bot connection = member connection
		if (connection && connection.channel.id === channel.id) {
			// then leave
			const voice = await channel.leave();
			return simpleEmbed(message, `Successfully left channel ${voice.channel.name}.`);
		}
	} catch(error) {
		log('error', 'leave@leave_channel', error);
		return errorEmbed(message, error);
	}
})