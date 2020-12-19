import { Command } from '../../lib/Command.js'
import fetch from 'node-fetch'

export default new Command({
	name: 'avatar',
	aliases: ['av'],
	cooldown: 5000
}, async (msg) => {
	const [...query] = msg.args;

	// Find in any possible scenarios
	let member = (
		msg.mentions.members.first()
		|| msg.guild.members.cache.get(msg.args[0])
		|| msg.guild.members.cache.find(m => m.user.username === msg.args.join(' '))
		|| msg.guild.members.cache.find(m => m.user.tag === msg.args.join(' '))
	) || msg.args[0] || msg.member;
	// Resolve
	member = typeof member === 'string' ? member : member.user.id;

	const data = await fetch(`https://discord.com/api/users/${member}`, {
		headers: { 
			"Authorization": `Bot ${msg.client.token}`
		}
	}).then(res => res.json());

	return msg.channel.send({ embed: {
		title: `Avatar for ${data.username}`,
		color: 'ORANGE',
		image: {
			url: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${data.avatar.substring(0, 2) === 'a_' ? 'gif' : 'png'}?size=4096`
		}
	}})
});