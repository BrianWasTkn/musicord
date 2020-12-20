const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

module.exports = class UtilAvatar extends Command {
	constructor() {
		super('avatar', {
			aliases: ['avatar', 'av'],
			channel: 'guild',
			typing: true,
			cooldown: 10000,
			rateLimit: 2
		});
	}

	async exec(message, args) {
		const query = args.join(' ');

		let resolvable = (
			message.mentions.members.first()
			|| message.guild.members.cache.get(args[0])
			|| message.guild.members.cache.find(m => m.user.username ===query)
			|| message.guild.members.cache.find(m => m.user.tag === query)
		) || args[0] || message.member;
		resolvable = typeof resolvable === 'string' ? resolvable : resolvable.user.id;

		const data = await fetch(`https://discord.com/api/users/${resolvable}`, {
			headers: { 
				"Authorization": `Bot ${this.client.token}`
			}
		}).then(res => res.json());

		const resolved = new User(this.client, data);
		await message.channel.send(this.client.util.embed({
			title: `Avatar for ${resolved.tag}`,
			color: 'ORANGE',
			image: {
				url: resolved.avatarURL({
					dynamic: true,
					size: 4096
				})
			},
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		}))

	}
}