import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { simpleEmbed, generateError } from '../utils/embed.js'

export default new Command({
	name: 'join',
	aliases: ['bound'],
	description: 'join your voice channel.',
	usage: 'command'
}, async (bot, message) => {
	
	const { channel } = message.member.voice;
	if (!channel) 
		return simpleEmbed(message, 'You need to join a Voice Channel first.');
	
	try {
		const c = await channel.join();
		return simpleEmbed(message, `successfully joined channel **${channel.name}**`);
	} catch(error) {
		log('error', 'join@join_channel', error);
		return generateError(message, error);
	}
})