import { Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class DiscordListener extends Listener {
	public client: Akairo.Client;
	public constructor() {
		super('spawner', {
			emitter: 'client',
			event: 'message'
		});
	}

	public async exec(message: Message): Promise<Message> {
		if (!this.client.config.spawns.enabled) return;
		if (message.author.bot || message.channel.type === 'dm') return;

		const spawner: Akairo.Spawn = this.client.spawnHandler.modules.random();
		const { unpaid } = await this.client.db.spawns.fetch(message.author.id);
		if (Math.round(Math.random() * 100) < (100 - spawner.config.odds)) return;
		if (unpaid >= 10000000) return;

		const handler = this.client.spawnHandler;
		const { whitelistedCategories, blacklistedChannels } = this.client.config.spawns;
		if (handler.cooldowns.has(message.author.id)) return;
		if (handler.queue.has(message.channel.id)) return;
		if (blacklistedChannels.includes(message.channel.id)) return;
		if (!whitelistedCategories.includes(message.channel.parentID)) return;

		await handler.spawn(spawner, message);
	}
}
