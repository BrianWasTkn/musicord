const Command = require('../../lib/command/Command.js');

module.exports = new Command({
	name: 'spam',
	aliases: ['s'],
	description: 'Starts a spam event.'
}, async ({ msg, args }) => {
	let [str, lock] = args;
	const { channel } = msg;
	if (!str) {
		return msg.reply('You need to put up something to spam');
	}

	let filter = m => m.content.toLowerCase() === str.toLowerCase();
	let c = await channel.createMessageCollector(filter, {
		time: 30000,
		max: Infinity
	});

	c.on('collect', async (m) => {
		await m.react('✅');
	}).on('end', async (col) => {
		await channel.send(col.array().map((c, i) => {
			return `**#${i + 1}: ${c.content}`;
		}));
	});
});