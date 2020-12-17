const { readdirSync } = require('fs');
const { join } = require('path');

const random = arr => arr[Math.round(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

exports.run = async ctx => {
	ctx.on('message', async msg => {
		const dir = readdirSync(join(__dirname, '..', 'spawns')).map(e => {
			return require(join(__dirname, '..', 'spawns', e));
		});
		const spawn = random(dir);

		if (Math.random() > 0.6) {
			if (channel.id !== '695614620781641778') {
				return;
			}
			/* {Collection} results - the results */
			const results = await spawn.run(ctx, msg);
			await msg.channel.send({ embed: results });
		}
	});
}