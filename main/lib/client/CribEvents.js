const { Collection } = require('discord.js');

function randomInArray(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

async function startCollecting(str, time = 15000) {
	const filter = m => m.content.toLowerCase() === str.toLowerCase();
	this.channel.awaitMessages(filter, {
		time, max: Infinity
	}).then(async collected => {
		if (!collected.first()) {
			return this.channel.send(`No one got the event.`);
		} else {
			return collected;
		}
	});
}

async function endResults(title, color, collected) {
	// TODO:
}

exports.Cribmas = {
	name: 'Merry Cribmas!',
	text: 'It\'s christmas time! Grab some free treats.',
	run: async (msg) => {
		const { channel } = msg;
		await channel.send(`Type \`Merry Christmas\``);
		const collected = await startCollecting.call(msg, `Merry Christmas`);
		let results = await endResults.call(this.name, 0x8bc34a, collected);
		return msg.channel.send(results);
	}
}