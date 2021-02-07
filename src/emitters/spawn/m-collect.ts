import { 
	Listener
} from 'discord-akairo'
import {
	Message 
} from 'discord.js'

export default class SpawnListener extends Listener {
	public client: Akairo.Client;
	public constructor() {
		super('spawn-messageCollect', {
			event: 'messageCollect',
			emitter: 'spawnHandler'
		});
	}

	public async exec(
		handler: Akairo.SpawnHandler, 
		spawner: Akairo.Spawn, 
		msg: Message,
		isFirst: boolean
	): Promise<void> {
		spawner.answered.set(msg.author.id, msg.member.user);
		if (isFirst) {
			await msg.react('<:memerGold:753138901169995797>');
		} else {
			await msg.react(spawner.spawn.emoji);
		}
	}
}