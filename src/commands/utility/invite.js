import Command from '../../classes/Command/Utility.js'
import { log } from '../../utils/logger.js'
import { 
	dynamicEmbed, 
	errorEmbed 
} from '../../utils/embed.js'

export default new Command({
	name: 'avatar',
	aliases: ['av', 'icon'],
	description: 'Invite the bot in your discord server.',
	usage: 'command'
}, async (bot, message, args) => {
	try {
		/** Generate Invite */
		const invite = await bot.generateInvite({
			permissions: [
				'SEND_MESSAGES', 'READ_MESSAGES', 
				'READ_MESSAGE_HISTORY', 'EMBED_LINKS',
				'CONNECT', 'SPEAK', 'MOVE_MEMBERS'
			]
		});

		/** Then return message */
		return dynamicEmbed({
			title: 'Add me to your server',
			color: 'BLUE',
			text: bot.package.description,
			fields: {
				'Invite': { 			content: `[Link](${invite})`, 										inline: true },
				'Source Code': {	content: `[Link](${bot.package.repository.url}`, 	inline: true },
				'DisTube': {			content: `[Docs](https://distube.js.org)`,				inline: true}
			},
			footer: {
				text: `Thanks for using ${bot.user.username}!`,
				icon: bot.user.avatarURL()
			}
		})
	} catch(error) {
		log('error', 'invite@main_command', error);
		return errorEmbed({ title: 'info@main_command', error: error });
	}
})