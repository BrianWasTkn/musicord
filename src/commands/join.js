import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	generateError 
} from '../utils/embed.js'

export default new Command({
	name: 'join',
	aliases: ['bound'],
	description: 'join your voice channel.',
	usage: 'command'
}, async message => {	
	try {
		const { channel } = message.member.voice;
		// is Joinable
		if (!channel.joinable) {
			return simpleEmbed(message, 'Make sure I have permissions to join your Voice Channel.');
		}
		// I can speak?
		if (!channel.speakable) {
			return simpleEmbed(message, 'Ensure I have permissions to speak in your voice channel or I won\'t be able to play songs.');
		}
		// Already In
		if (channel.members.has(message.client.user.id)) {
			return simpleEmbed(message, `I'm already in voice channel ${channel.name}.`);
		}
		// Channel is Full
		if (channel.full) {
			return simpleEmbed(message, 'The voice channel is currently full, unable to join channel.');
		}
		// Else, join
		const voice = await channel.join();
		return simpleEmbed(message, `Successfully joined channel ${channel.name}!`);
	} catch(error) {
		log('error', 'join@join_channel', error);
		return generateError(message, error);
	}
})