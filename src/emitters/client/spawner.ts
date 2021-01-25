import { Client, Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Discord extends Listener {
	public client: Client;
	public constructor() {
		super('spawner', {
			emitter: 'client',
			event: 'message'
		});
	}

	public async exec(message: Message): Promise<Message> {
		if (!this.client.config.spawns.enabled) return;
		if (message.author.bot || message.channel.type === 'dm') return;

		const spawner = this.client.util.randomInArray(this.client.spawners.array());
		const { queue, config: { spawns } } = this.client;
		if (queue.has(message.member.user.id)) return;
		if (spawns.blacklisted.channels.includes(message.channel.id)) return;
		if (!spawns.whitelisted.categories.includes(message.channel.parentID)) return;

		if (Math.round(Math.random() * 100) >= (100 - spawner.config.odds)) {
			const results = await spawner.run(message);
			if (results) await message.channel.send({ embed: results });
			else return;
		}
	}
}
