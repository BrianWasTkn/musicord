const Command = require('../../lib/command/Command.js');

module.exports = new Command({
	name: 'thx',
	aliases: ['ty'],
	description: 'Thanks somebody for sponsoring a heist.'
}, async ({ ctx, msg, args }) => {
	if (!msg.member._roles.includes('692941106475958363')) return;

	let [target, coins] = args;
	const { guild, channel } = msg;

	let member = guild.members.cache.get(target)
	|| guild.members.cache.find(m => m.user.username.toLowerCase() === target.toLowerCase())
	|| guild.members.cache.find(m => m.user.tag.toLowerCase() === target.toLowerCase())
	|| msg.mentions.members.first() || false;

	if (!member) return msg.reply('you have to mention a valid user, bruh.');
	let amount = Number(coins) || parseInt(coins, 10);
	if (!amount) return msg.reply('pls enter a valid numbar tenchu');

	let emoji = guild.emojis.cache.get('717347901587587153');
	emoji = `<:${emoji.name}:${emoji.id}>`;
	await channel.send({ embed: {
		title: 'Thank you ❤️',
		thumbnail: { url: member.user.avatarURL() },
		color: member.displayHexColor || 'BLUE',
		description: [
			`Please thank <@${member.nickname ? '!' : ''}${member.user.id}> for`,
			`this wonderful **${amount.toLocaleString()}** coin heist!`
		].join(' '),
		footer: {
			text: guild.name, iconURL: guild.iconURL()
		}
	}});
});