import Command from '../classes/Command/Music.js'
import { Collection } from 'discord.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed,
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'voteskip',
	aliases: ['vs'],
	description: 'Vote skip the current song playing in the queue.',
	usage: 'command'
}, async (bot, message, args) => {
	
	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	const channel = message.member.voice.channel;
	if (channel.members.size < 3) {
		try {
			await bot.player.skip(message);
			return;
		} catch(error) {
			log('error', 'voteskip@skip_on_size_is_less_3', error);
		}
	}

	try {
		const voters = new Collection();
		const filter = m => ['!voteskip', '!revoke'].some(cmd => cmd === m.content.toLowerCase());
		const collector = await message.channel.createMessageCollector(filter, {
			max: size,
			time: 60000,
			errors: ['time']
		})

		/** Collect */
		collector.on('collect', async msg => {
			try {

				// Voteskip
				if (msg.content === '!voteskip') {
					if (!voters.has(msg.author.id)) {
						const user = voters.set(msg.author.id, 'voted');
						await msg.channel.send(dynamicEmbed({
							title: 'Vote Skipped',
							color: 'BLUE',
							info: `**${msg.author.tag}** vote skipped.`,
							footer: {
								text: 'Type "!voteskip" to vote for skipping | "!revoke" to revoke your vote.',
								icon: msg.author.avatarURL()
							}
						}))
					} else {
						await msg.reply('You already voteskipped.');
					}
				} 

				// Revoke
				if (msg.content === '!revoke') {
					if (!voters.has(msg.author.id)) {
						await msg.reply('You can\'t revoke as you haven\'t voteskipped yet.')
					} else {
						const user = await voters.delete(msg.author.id);
						await msg.channel.send(dynamicEmbed({
							name: 'Vote Revoked',
							color: 'INDIGO',
							info: `**${msg.author.tag}** revoked skipping.`,
							footer: {
								text: 'Type "!voteskip" to vote for skipping | "!revoke" to revoke your vote.',
								icon: msg.author.avatarURL()
							}
						}))
					}
				}
			} catch(error) {
				log('commandError', 'voteskip@collector.sendMessage', error);
				return error;
			}
		}).on('end', async voted => {
			if (collected.size > Math.round(channel.members.size / 2)) {
				try {
					await message.channel.send(dynamicEmbed({
						title: 'Skipping',
						color: 'GREEN',
						info: 'Skipping the song as half of the total amount of members in the voice channel vote skipped.',
						fields: {
							'Channel': {	content: channel.name, inline: true },
							'Voted': { 		content: `${voted.size.toLocaleString()}/${channel.members.size}`, inline: true },
							'Members': {  content: channel.members.size, inline: true }
						}
					}));
					try {
						await bot.player.skip();
					} catch(error) {
						log('commandError', 'voteskip@collected.on(end).skip', error);
					}
				} catch(error) {
					log('commandError', 'voteskip@collected.on(end).sendMessage', error);
				}
			} else {
				await message.channel.send(dynamicEmbed({
					title: 'Not Skipping',
					color: 'RED',
					info: 'Vote skippers lost, less than half of the total amount of members in the voice channel vote skipped.',
					fields: {
						'Channel': {  content: channel.name, inline: true },
						'Voted': {		content: `${voted.size.toLocaleString()}/${channel.members.size}`, inline: true },
						'Members': {	content: channel.members.size, inline: true }
					}
				}))
			}
		})
	} catch(error) {
		log('error', 'voteskip@collector', error.stack);
		return errorEmbed(message, error);
	}
})