import { Listener, LavaListener, LavaClient } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class Discord extends Listener implements LavaListener {
	public client: LavaClient;
	public constructor() {
		super('spawner', {
			emitter: 'client',
			event: 'message'
		});
	}

	public async exec(message: Message): Promise<MessageEmbed> {
		if (message.author.bot || message.channel.type === 'dm') return;
		const spawner = this.client.utils.random('arr', this.client.spawners.array());
		const { queue, config } = spawner;
		if (queue.has(message.channel.id)) return;
		
		if (Math.random() * 100 >= 100 - config.odds) {
			const results = await spawner.run(message);
			if (results) await message.channel.send({ embed: results });
			else return;
		};
	}
}