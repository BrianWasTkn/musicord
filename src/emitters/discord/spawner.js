const { Listener } = require('discord-akairo');

/**
 * Discord Message event
 * @exports @class @extends Listener
*/
module.exports = class Lava extends Listener {
	constructor() {
		super('spawner', {
			emitter: 'client',
			event: 'message'
		});
	}

	async exec(message) {
		if (message.author.bot || message.channel.type === 'dm') return;
		const spawner = this.client.util.random('arr', this.client.spawners.array());
		const { queue, config } = spawner;
		if (queue.has(message.channel.id)) return;
		
		if (Math.random() * 100 >= 100 - config.odds) {
			const results = await spawner.run(message);
			if (results) await message.channel.send({ embed: results });
			else return;
		};
	}
}