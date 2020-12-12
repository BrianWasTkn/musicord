const Command = require('../../lib/command/Command.js');

module.exports = new Command(
	async ({ msg }) => {
		let { channel } = msg;
		let member = msg.mentions.members.first();
		let odds = Math.random();
		if (odds > 0.5) {
			if (!member.bannable) {
				return await channel.send(`**${member.user.tag}** is about to get banned\n\nbut not bannable :thinking:`);
			}

			let banned = await member.ban(member.id, `${msg.author.tag} ${msg.author.id} did this <_<`);
			await msg.channel.send(`**oh no...** you b@nned **${member.tag}** with the odds of ${odds.toFixed(2)}! christ you're so road.`); 
		} else {
			await msg.channel.send(`${member.tag} is safe, yay! odds are \`${odds.toFixed(2)}\` btw.`);
		}
	}, {
		name: 'b@n',
		aliases: ['bonbon'],
		userPerms: ['BAN_MEMBERS'],
		botPerms: ['BAN_MEMBERS']
	}
)