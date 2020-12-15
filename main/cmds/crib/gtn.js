const Command = require('../../lib/command/Command.js');

module.exports = new Command({
	name: 'gtn',
	aliases: ['guessthenumber'],
	description: 'Starts a guess the number event.'
}, async ({ msg, args }) => {
	const { guild, channel, author } = msg;
	let iter = 0;
	let questions = [
		'Any minimum possible number? Default is `1` only.',
		'Any max possible number? Default is `100` only.',
		'What should be the guessing number?',
		'What\'s the price for this event?',
		'Should we lock the channel after the number has been guessed?'
	];

	const filter = m => m.author.id === author.id;
	const collector = await channel.createMessageCollector(filter, {
		max: questions.length,
		idle: 30000,
	});

	await channel.send(questions[iter++]);
	collector.on('collect', async m => {
		await channel.send(questions[iter++]);
		collector.resetTimer({ time: 30000 });
	}).on('end', async col => {
		const m = col.first();
		if (!m) {
			await col.first().channel.send({ embed: {
				title: 'Timed Out',
				color: 'RED'
			}});
		} else {
			await m.channel.send(col.map((c, i) => {
				return `**#${i + 1}:** ${c.content}`;
			}).join('\n'));
		}
	});

});