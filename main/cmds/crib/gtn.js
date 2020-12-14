const Command = require('../../lib/command/Command.js');

module.exports = new Command({
	name: 'gtn',
	aliases: ['guessthenumber']
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
		max: 3,
		time: Infinity,
		errors: ['time']
	});

	let ms = await channel.send(questions[iter++]);
	collector
	.on('collect', async m => {
		await ms.delete();
		await m.delete();
		ms = await channel.send(questions[iter++]);
	})
	.on('end', async col => {
		if (col.size < 5) {
			return msg.reply('Either you\'re ignoring me or AFK, who knows, might be the first one.');
		}
	});

});