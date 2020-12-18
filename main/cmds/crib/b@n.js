const Command = require('../../lib/command/Command.js');

module.exports = new Command({
	name: 'b@n',
	aliases: ['bonbon'],
	description: 'Bans your target on the odds of 50-50.',
	userPerms: ['BAN_MEMBERS'],
	botPerms: ['BAN_MEMBERS']
}, async ({ msg }) => {
	let { channel, author } = msg;
	let member = msg.mentions.members.first();
	let odds = Math.random();

	if (member.user.bot) {
		return channel.send(`are you out of ur mind lol, imagine b@nning bots.`);
	}

	if (member.user.id === author.id) {
		return channel.send(`stop b@nning yourself lol`)
	}

	if (!member.bannable) {
		return await channel.send(`**${member.user.tag}** is not b@nnable sowwy`);
	}

	if (odds > 0.5) {
		let banned = await member.ban(member.user.id, `${msg.author.tag} ${msg.author.id} did this <_<`);
		await channel.send(`**oh no...** you b@nned **${member.tag}** with the odds of \`${odds.toFixed(2)}\`! christ you're so road.`); 
	} else {
		await channel.send(`${member.user.tag} is safe, yay! odds are \`${odds.toFixed(2)}\` btw.`);
	}
});