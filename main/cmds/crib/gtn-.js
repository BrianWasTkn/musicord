const Command = require('../../lib/command/Command.js');

let questions = [
	'Any **minimum** possible number? `1` by default.',
	'Any **maximum** possible number? `100` by default.',
	'What should be the **target** number?',
	'What should be the prize for this event?'
];

module.exports = new Command({
	name: 'gtn-',
	aliases: ['guessthenumber-'],
	description: 'Starts a guess the number event.'
}, async ({ msg, args }) => {
	return;
});