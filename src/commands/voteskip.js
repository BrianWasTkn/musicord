import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'voteskip',
	aliases: ['vs'],
	description: 'Vote skip the current song playing in the queue.',
	usage: 'command'
}, async (bot, message, args) => {
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) return 'There\'s nothing playing in the queue.';

	const channel = message.member.voice.channel,
	size = channel.members.size;
	if (size <= 3) {
		return 'You cannot voteskip as only 3 people are in the voice channel.';
	}

	try {
		const filter = m => m.content === '!voteskip';
		c = await message.channel.createMessageCollector(filter, {
			max: size,
			time: 60000,
			errors: ['time']
		})

		c.on('collect', async m => {
			await message.channel.send(`**${m.author.tag}** voted to skip!`);
		}).on('end', async collected => {
			if (collected.size >= Math.floor(size)) {
				await message.channel.send(`Only **${collected.size}** people voted to skip.\nNow skipping song as more than half of the member size in the channel voted to skip.`);
				await bot.player.skip(message);
			} else {
				await message.channel.send(`Only **${collected.size}** voted to skip which isn't enough to fully skip the current song.`);
			}
		})
	} catch(error) {
		log('error', 'voteskip@collector', error.stack);
		return error;
	}
})