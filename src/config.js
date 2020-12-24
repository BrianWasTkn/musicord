exports.config = {
	// Bot
	dev: false,
	prefix: ['lava', ';;'],
	token: process.env.TOKEN,
	owners: ['605419747361947649'],

	// Server
	spawns: {
		'merry-cribmas': require('./spawns/merry-cribmas.js')
	}
};