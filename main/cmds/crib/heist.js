const Command = require('../../lib/command/Command.js');

module.exports = new Command(
async ({ msg }) => {
	const { channel, guild } = msg;
	channel.send(`Type \`JOIN EVENT\` to join!`);
	let filter = m => m.content.toLowerCase() === 'join event';
	const entries = new (require('discord.js').Collection)();
	const collector = await channel.createMessageCollector(filter, {
		max: Infinity,
		time: 30000,
		errors: ['time']
	});

	collector.on('collect', async m => {
		if (entries.has(m.author.id)) {
			return m.reply('you already joined.');
		} else {
			entries.set(m.author.id, true);
			await m.react('💰');
		}
	}).on('end', async col => {
		// const random = arr => arr[Math.floor(Math.random() * arr.length)];
		if (col.size <= 1) {
			return col.first().reply(`Looks like you're alone.`);
		}

		let winners = col.random(Math.round(Math.random() * col.size));
		let losers = col.filter(l => !winners.includes(l));
		let coins = Math.floor(10e6 / winners.length);

		await channel.send(`**${col.size}** ${col.size > 1 ? 'people are' : 'person is'} teaming up to win the grand prize.`);
		await require('discord.js').Util.delayFor(Math.round(Math.random() * 5) * 1000);
	
		// if (winners) {}
		winners = winners.length > 0 ? winners.map(w => {
			return `+ ${w.author.username} grabbed ${coins.toLocaleString()} coins.`;
		}) : [];
		losers = losers.length > 0 ? losers.map(l => {
			return `- ${l.author.username} died LOL`;
		}) : [];

		if ([...winners, ...losers].length <= 0) {
			return await channel.send(`\`${col.map(u => u.author.username).join('`, `')}\` failed the event.`);
		} else {
			await channel.send(`${winners.join('\n')}\n${losers.join('\n')}`, {
				code: 'diff'
			});
		}

		// let wString = winners.length > 1 ? (winners.map(w => `+ ${w.author.username} grabbed ${coins.toLocaleString()} coins!`).join('\n')) : [];
		// let lString = losers.length > 1 ? (losers.map(l => `- ${l.author.username} died LOL`).join('\n')) : [];
		// await channel.send([wString, lString].join('\n'), { code: 'diff' });
		// await channel.send(winners.length > 1 ? winners.map(w => `+ ${w.author.username} grabbed ${coins.toLocaleString()} coins`).join('\n') : '# none', {
		// 	code: 'diff'
		// });
		// await channel.send(losers.length > 1 ? losers.map(l => `- ${l.author.username} died LOL`).join('\n') : '# none', {
		// 	code: 'diff'
		// });
	});
}, {
	name: 'fakeheist',
	aliases: ['fh']
}
)