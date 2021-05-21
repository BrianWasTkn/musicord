const TagError = require('../TagError');
const Tag = require('../Tag');

module.exports = new Tag(function(ctx, args) {
	if (!args.length) throw new TagError('breh you should specify a number');
	return args.map(Number).reduce((p, c) => p + c);
}, {
	name: 'add',
	args: '<num1> <num2>',
	aliases: ['add'],
	description: 'Add numbers owo',
	dependencies: []
});