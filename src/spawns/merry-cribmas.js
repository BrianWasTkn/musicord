const { Collection } = require('discord.js');

exports.config = {
	// Odds
	odds: 5,
	// Collector
	time: 5000,
	max: Infinity,
	// Rewards
	rewards: {
		min: 5000, 
		max: 100000
	},
	// Visuals
	emoji: '<:PES_Exit:745459552870465586>',
	eventType: 'TypeIt',
	title: 'Merry Cribmas',
	description: 'It\'s a special day for Memers Crib!',
	strings: [
		'merry chribmas', 'amonic', 'nice spam', 'brain',
		'damn son', 'ashol', 'atomic bomb', 'tangerine',
		'Lee oh.', 'finding dory', 'baddie claus', 'hi trend',
		'son of a crib'
	]
}