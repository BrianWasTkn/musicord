import { Command } from '../../lib/Command/Command.js'

export default new Command({
	name: 'play',
	aliases: ['p'],
	cooldown: 3000
}, async (msg) => {
	const [...query] = msg.args;
	const { distube } = msg.client;
	const embed = {};
	if (!query) {
		embed.title = 'Missing Arguments';
		embed.color = 'RED';
		embed.description = 'You need to play something for this command to work.';
		embed.footer = {};
		embed.footer.text = msg.client.user.username;
		embed.footer.iconURL = msg.client.user.avatarURL();
		return msg.reply({ embed });
	}

	try {
		await distube.play(msg, query.join(' '));
	} catch(error) {
		msg.reply(error.message);
	}
});