const TagError = require('../TagError');
const Tag = require('../Tag');

module.exports = new Tag(function(ctx, args) {
	throw new TagError(args.join(' '), {});
}, {
	name: 'throw',
	args: '<message>',
	description: 'Throw an error.',
	dependencies: []
});