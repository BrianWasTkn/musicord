import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'join',
	aliases: ['bound'],
	description: 'join your voice channel.',
	usage: 'command'
}, async (bot, message) => {
	
	const { channel } = message.member.voice;
	if (!channel) return 'you need to join a voice channel first!';
	try {
		const c = await channel.join();
		return `successfully joined channel **${channel.name}**`;
	} catch(error) {
		log('error', 'join@join_channel', error);
		return error.message;
	}
})