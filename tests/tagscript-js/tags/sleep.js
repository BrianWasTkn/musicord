const TagError = require('../TagError');
const Tag = require('../Tag');

module.exports = new Tag(async function(ctx, [timeout]) {
	await new Promise(res => setTimeout(res, timeout * 1e3));
}, {
	name: 'sleep',
	args: '<timeout>',
	aliases: ['delay'],
	description: 'Delay the output owo',
	dependencies: []
});