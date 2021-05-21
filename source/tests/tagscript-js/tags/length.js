const TagError = require('../TagError');
const Tag = require('../Tag');

module.exports = new Tag(function(ctx, [args]) {
	return args.length;
}, {
	name: 'length',
	args: '<thing>',
	aliases: ['size'],
	description: 'See the length of a given string.',
	dependencies: []
});