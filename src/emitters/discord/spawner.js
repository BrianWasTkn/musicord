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
		
		// Loop through all spawns and find 
		// a spawn that hit the odds to run.
		this.client.spawners.array().forEach(async spawner => {
			const { queue, config } = spawner;
			if (Math.random() * config.odds >= 100 - config.odds) {
				const results = await spawner.run(message);
				if (results) return await message.channel.send({ embed: results });
				else return;
			}
		});
	}
}