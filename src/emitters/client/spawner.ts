import { Message, MessageEmbed } from 'discord.js'
import Lava from 'discord-akairo'

export default class Discord extends Lava.Listener {
	public client: Lava.Client;
	public constructor() {
		super('spawner', {
			emitter: 'client',
			event: 'message'
		});
	}

	public async exec(message: Message): Promise<MessageEmbed | any> {
		if (!this.client.config.spawns.enabled) return;
		if (message.author.bot || message.channel.type === 'dm') return;

		const spawner = this.client.util.random('arr', this.client.spawners.array());
		const { queue, config: { spawns } } = this.client;
		if (queue.has(message.member.user.id)) return;
		if (!spawns.whitelisted.channels.includes(message.channel.id)) return;
		if (spawns.blacklisted.channels.includes(message.channel.id)) return;
		if (!spawns.whitelisted.categories.includes(message.channel.parentID)) return;

		if (Math.round(Math.random() * 100) >= (100 - spawner.config.odds)) {
			const results = await spawner.run(message);
			if (results) await message.channel.send({ embed: results });
			else return;
		}
	}
}
