const { Command } = require('discord-akairo');
const { User } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class UtilityCommand extends Command {
	constructor() {
		super('avatar', {
			aliases: ['avatar', 'av'],
			channel: 'guild',
			category: 'Utility',
			typing: true,
			cooldown: 10000,
			rateLimit: 2,
			args: [
				{ id: 'query', type: 'content' }
			]
		});
	}

	async exec(message, args) {
		let resolvable = (
			message.mentions.members.first()
			|| message.guild.members.cache.get(args.query)
			|| message.guild.members.cache.find(m => m.user.username === args.query)
			|| message.guild.members.cache.find(m => m.user.tag === args.query)
		) || args.query || message.member;
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