const { readdirSync } = require('fs');
const { join } = require('path');

const random = arr => arr[Math.round(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

exports.run = async ctx => {
	ctx.on('message', async msg => {
		const events = readdirSync(join(__dirname, '..', 'spawns'));
		const spawn = require(join(__dirname, '..', 'spawns', random(events)));
		console.log(spawn);

		const spawn = random(dir);

		if (Math.random() > 0.6) {
			if (msg.channel.id !== '695614620781641778') {
				return;
			}
			/* {Collection} results - the results */
			const results = await spawn.run(ctx, msg);
			await msg.channel.send({ embed: results });
		}
	});
}