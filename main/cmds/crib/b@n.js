const Command = require('../../lib/command/Command.js');

module.exports = new Command(
	async ({ msg }) => {
		let member = msg.mentions.members.first();
		let odds = Math.random();
		if (odds > 0.5) {
			member = await member.ban(`${msg.author.tag} ${msg.author.id} did this <_<`);
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