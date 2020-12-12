const Command = require('../../lib/command/Command.js');

module.exports = new Command(
	async ({ msg }) => {
		const { channel, guild } = msg;
		channel.send(`Type \`JOIN EVENT\` to join!`);
		let filter = m => m.content.toLowerCase() === 'join event';
		const collector = await channel.createMessageCollector(filter, {
			max: Infinity,
			time: 30000,
			errors: ['time']
		});

		collector.on('collect', async m => {
			await m.react('💰');
		}).on('end', async col => {
			// const random = arr => arr[Math.floor(Math.random() * arr.length)];
			if (col.size <= 1) {
				return col.first().reply(`Looks like you're alone.`);
			}
			let winners = col.random(Math.floor(Math.random() * col.size));
			let losers = col.filter(l => !winners.includes(winners));
			
			await channel.send(`**${col.size}** ${col > 1 ? 'people' : 'person'} is teaming up to win the grand prize.`);
			await channel.send(winners ? winners.map(w => `+ ${w.user.username}`) : '# none', {
				code: 'diff'
			});
			await channel.send(losers ? losers.map(l => `- ${w.user.username}`) : '# none', {
				code: 'diff'
			});
		});
	}, {
		name: 'fakeheist',
		aliases: ['fh']
	}
)