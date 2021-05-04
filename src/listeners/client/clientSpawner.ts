import { Context } from 'lib/extensions';
import { Listener } from 'lib/objects';
import { Lava } from 'lib/Lava';
import config from 'config/index';

export default class ClientListener extends Listener<Lava> {
	constructor() {
		super('spawner', {
			emitter: 'client',
			event: 'message',
			name: 'Message Spawner',
		});
	}

	public async exec(message: Context) {
		const { handlers, ownerID, db, util } = this.client;
		const { randomInArray, randomNumber, sleep } = util;

		if (!config.spawn.enabled) return;
		if (message.author.bot || message.channel.type === 'dm') return;

		const spawner = randomInArray([...handlers.spawn.modules.values()]);
		const handler = handlers.spawn;

		if (ownerID === message.author.id) {
			if (message.content === 'lava spawn') {
				await message.delete();
				return await handler.spawn(spawner, message);
			}
		}

		const { unpaid } = await db.spawns.fetch(message.author.id);
		if (Math.round(Math.random() * 100) < 100 - spawner.config.odds) return;
		if (unpaid >= config.spawn.cap) return;

		const { cats, bl } = config.spawn;
		if (handler.cooldowns.has(message.author.id)) return;
		if (handler.queue.has(message.channel.id)) return;
		if (!cats.includes(message.channel.parentID)) return;
		if (bl.includes(message.channel.id)) return;

		await sleep(randomNumber(1, 2) * 1e3);
		return await handler.spawn(spawner, message);
	}
}
