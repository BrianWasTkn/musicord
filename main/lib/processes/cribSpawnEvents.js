const { readdirSync } = require('fs');
const { join } = require('path');

const random = arr => arr[Math.round(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

exports.run = async ctx => {
	ctx.on('message', async msg => {
		const dir = readdirSync(join(__dirname, '..', 'spawns'));
		const event = random(dir);
		const spawn = require(join(__dirname, '..', 'spawns', event));

		if (Math.random() > 0.6) {
			/* {Collection} results - the results */
			const results = await spawn.run(ctx, msg);
			await msg.channel.send({ embed: results });
		}
	});
}