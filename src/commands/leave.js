import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'leave',
	aliases: ['leavechannel'],
	description: 'leave your voice channel.',
	usage: 'command'
}, async (bot, message) => {
	
	const { channel } = message.member.voice;
	if (!channel) return 'you need to join a voice channel first!';
	try {
		const voice = await channel.leave();
		return `successfully left channel **${channel.name}**`;
	} catch(error) {
		log('error', 'join@leave_channel', error);
		return error.message;
	}
})