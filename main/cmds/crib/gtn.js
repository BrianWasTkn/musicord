const Command = require('../../lib/command/Command.js');

module.exports = new Command({
	name: 'gtn',
	aliases: ['guessthenumber'],
	description: 'Starts a guess the number event.'
}, async ({ msg, args }) => {
	const { guild, author } = msg;
	let [min, max, target, ...prize] = args.split(',') || args;

	if (isNaN(min)) {
		return msg.reply('Your `min` argument should be a possible minimum number.');
	} else if (isNaN(max)) {
		return msg.reply('Your `maxn` argument should be a possible maximum number.');
	} else if (isNaN(target)) {
		return msg.reply('Your `target` argument should be a target number.');
	} else if (!prize) {
		return msg.reply('You need a prize for this event.');
	}

	[min, max, target] = [min, max, target].map(n => Number(n));
	if (min > max) {
		return msg.reply('Your `min` number shoul\'nt be higher `max` ones.');
	} else if ((target > max) || (target < min)) {
		return msg.reply('Your `target` number is out of range.');
	}

	if (!prize) {
		return msg.reply('You need a prize.');
	}

	let channel = guild.channels.cache.get('723355699035373649');
	await msg.channel.send({
		title: 'Guess the Number'
	})

});