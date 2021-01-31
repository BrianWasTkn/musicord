import { 
	Listener, Client,
	SpawnHandler, Spawn
} from 'discord-akairo'
import {
	Message, TextChannel
} from 'discord.js'

export default class SpawnListener extends Listener {
	public client: Client;
	public constructor() {
		super('spawn-messageStart', {
			event: 'messageStart',
			emitter: 'spawnHandler'
		});
	}

	public async exec(
		handler: SpawnHandler, 
		spawner: Spawn, 
		message: Message,
		str: string
	): Promise<void> {
		const { spawn } = spawner;
		const msg = await message.channel.send([
			`**${spawn.emoji} \`${spawn.type} EVENT WOO HOO!\`**`,
			`**${spawn.title}**`, spawn.description
		].join('\n'));

		await message.channel.send(`Type \`${str.split('').join('\u200b')}\``);
		handler.queue.set(message.channel.id, {
			msgId: msg.id,
			channel: (message.channel as TextChannel),
			spawn: spawner
		});
	}
}