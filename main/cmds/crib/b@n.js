const Command = require('../../lib/command/Command.js');

module.exports = new Command(
	async ({ msg }) => {
		let { channel, author } = msg;
		let member = msg.mentions.members.first();
		let odds = Math.random();

		if (member.user.bot) {
			return channel.send(`are you out of ur mind lol, imagine b@nning bots.`);
		}

		if (member.user.id === author.id) {
			return channel.send(`stop banning yourself lol`)
		}

		if (!member.bannable) {
			return await channel.send(`**${member.user.tag}** is not bannable sowwy`);
		}

		if (odds > 0.5) {
			let banned = await member.ban(member.user.id, `${msg.author.tag} ${msg.author.id} did this <_<`);
			await msg.channel.send(`**oh no...** you b@nned **${member.tag}** with the odds of ${odds.toFixed(2)}! christ you're so road.`); 
		} else {
			await msg.channel.send(`${member.user.tag} is safe, yay! odds are \`${odds.toFixed(2)}\` btw.`);
		}
	}, {
		name: 'b@n',
		aliases: ['bonbon'],
		userPerms: ['BAN_MEMBERS'],
		botPerms: ['BAN_MEMBERS']
	}
)