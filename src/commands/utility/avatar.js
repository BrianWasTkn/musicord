import Command from '../../classes/Command/Utility.js'
import { log } from '../../utils/logger.js'
import { simpleEmbed, dynamicEmbed } from '../../utils/embed.js'

export default new Command({
	name: 'avatar',
	aliases: ['av', 'icon'],
	description: 'View the avatar of someone in this guild.',
	usage: '[@user | user#0001 | user]'
}, async (bot, message, args) => {

	/** Fetch User */
	const user = message.member.mentions.first();
	if (!user) {
		return simpleEmbed({
			title: 'Invalid Member',
			color: 'RED',
			text: 'The user is either not in this guild or doesn\'t exist.'
		});
	}

	/** Format links */
	const format = (user) => ({
		png: user.avatarURL({ format: 'png' }),
		webp: user.avatarURL({ format: 'webp' }),
		jpg: user.avatarURL({ format: 'jpg' }),
		links: () => {
			return ['png', 'webp', 'jpg']
			.map((f, i) => `[${f}](${Object.entries(format(user)).map(e => e[1])[i]})`)
			.join(' | ')
		}
	});

	/** Return Message */
	return dynamicEmbed({
		title: `Avatar — ${user.tag}`,
		color: 'RANDOM',
		text: `Format Links\n${format(user).links()}'`,
		icon: user.avatarURL(),
		footer: {
			text: `Thanks for using ${bot.user.username}!`,
			icon: bot.user.avatarURL()
		}
	})
})