import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'join',
	aliases: ['bound'],
	description: 'join your voice channel.',
	usage: 'command'
}, async message => {	
	try {
		const { channel } = message.member.voice;
		/** <VoiceChannel> is joinable */
		if (!channel.joinable) {
			return simpleEmbed({
				title: 'Cannot Join',
				color: 'RED',
				text: 'Make sure I have permissions to join your voice channel.'
			});
		}
		/** <VoiceChannel> is speakable */
		if (!channel.speakable) {
			return simpleEmbed({
				title: 'Cannot Speak',
				color: 'RED',
				text: 'Ensure I have permissions to `SPEAK` in your voice channel to play music.'
			});
		}
		/** <Client> is already in */
		if (channel.members.has(message.client.user.id)) {
			return simpleEmbed({
				title: 'Already In',
				color: 'RED',
				text: `I'm already in voice channel **${channel.name}**!`
			});
		}
		/** <VoiceChannel> is full */
		if (channel.full) {
			return simpleEmbed({
				title: 'Channel Full',
				color: 'RED',
				text: 'The voie channel is already full, cannot join.'
			});
		}
		/** Join if any of the checks above returned false */
		const voice = await channel.join();
		return simpleEmbed({
			title: 'Channel Joined',
			color: 'GREEN',
			text: `Bound to **${channel.name}**, now ready.`
		})
	} catch(error) {
		log('error', 'join@main_command', error);
		return errorEmbed({ title: 'join@main_command', error: error });
	}
})