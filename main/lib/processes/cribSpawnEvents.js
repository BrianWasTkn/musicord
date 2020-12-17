const { readdirSync } = require('fs');
const { join } = require('path');

const random = arr => arr[Math.floor(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

exports.run = async ctx => {
	ctx.on('message', async msg => {
		const events = readdirSync(join(__dirname, '..', 'spawns'));
		const spawn = require(join(__dirname, '..', 'spawns', random(events)));

		if (Math.random() > 0.6) {
			if (msg.channel.id !== '695614620781641778') {
				return;
			} else {
				await spawn.run(ctx, msg);
			}
		}
	});
}