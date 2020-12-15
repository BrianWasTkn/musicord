const Command = require('../../lib/command/Command.js');

module.exports = new Command({
	name: 'taxcalc',
	aliases: ['tc'],
	description: 'Calculates the taxes when sharing coins to others.'
}, async ({ msg, args }) => {
	let [amount] = args;
});