import { Command } from '../../lib/Command.js'
import fetch from 'node-fetch'

// Resolves a GuildMember
const resolveUser = (msg) => {
	return msg.guild.members.cache
	.get(msg.args[0]) || msg.guild.members.cache
	.find(m => {
		return m.user.username.toLowerCase() === msg.args.join(' ').toLowerCase()
	}) || msg.guild.members.cache.find(m => {
		return m.user.tag === msg.args.join(' ')
	}) || msg.mentions.members.first() || null;
}

export default new Command({
	name: 'avatar',
	aliases: ['av'],
	cooldown: 5000
}, async (msg) => {
	const [query] = msg.args;

	let member = resolveUser(msg);
	if (!member) member = msg.member;

	const data = await fetch(`https://discord.com/api/users/${member.user.id || msg.args[0]}`, {
		headers: { 
			"Authorization": `Bot ${msg.client.token}`
		}
	}).then(res => res.json());

	return msg.channel.send({ embed: {
		title: `Avatar for ${data.username}`,
		color: 'BLUE',
		image: {
			url: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${data.avatar.substring(0, 2) === 'a_' ? 'gif' : 'png'}?size=4096`
		}
	}})
});