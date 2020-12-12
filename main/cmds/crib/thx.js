const Command = require('../../lib/command/Command.js');

module.exports = new Command(
	async ({ ctx, msg, args }) => {
		if (!msg.member._roles.includes('692941106475958363')) return;

		let [target, coins] = args;
		const { guild, channel } = msg;

		let member = guild.members.cache.get(target)
		|| guild.members.cache.find(m => m.user.username.toLowerCase() === target.toLowerCase())
		|| guild.members.cache.find(m => m.user.tag.toLowerCase() === target.toLowerCase())
		|| msg.mentions.members.first() || false;

		if (!member) {
			return msg.reply('Unknown User');
		}

		let amount = Number(coins) || parseInt(coins, 10);
		if (!amount) {
			return msg.reply('Invalid or no amount.');
		}

		let emoji = guild.emojis.cache.get('717347901587587153');
		await channel.send({ embed: {
			title: 'Thank you ❤️',
			thumbnail: guild.iconURL(),
			color: member.displayHexColor || 'BLUE',
			description: `
<:${emoji.name}:${emoji.id}> Please thank <@${member.nickname ? '!' : ''}${member.user.id}> for this wonderful **${amount.toLocaleString()}** coin heist!
			`,
		}});

	}, {
		name: 'thx',
		aliases: ['ty'],
	}
)