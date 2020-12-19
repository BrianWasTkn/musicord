import { Command } from '../../lib/Command.js'
import fetch from 'node-fetch'

const resolveUser = () => {
	return this.guild.members.cache
	.get(this.args[0]) || this.guild.members.cache
	.find(m => m.user.username.toLowerCase() === this.args.join(' ').toLowerCase())
	|| this.guild.members.cache.find(m => m.user.tag === this.args.join(' '))
	|| this.mentions.members.first() || null;
}

export default new Command({
	name: 'avatar',
	aliases: ['av'],
	cooldown: 5000
}, async (msg) => {
	const [query] = msg.args;

	let member = (resolveUser.bind(msg))();
	if (!member) member = msg.member;

	const data = await fetch(`https://discord.com/api/users/${user.user.id}`, {
		headers: { 
			"Authorization": `Bot ${msg.client.token}`
		}
	}).then(res => res.json());

	return msg.channel.send({ embed: {
		title: `Avatar for ${data.username}`,
		color: 'BLUE',
		image: {
			url: `https://cdn.discordapp.com/avatars/${data.avatar}.${data.avatar.substring(0, 2) === 'a_' ? 'gif' : 'png'}?size=4096`
		}
	}})
});