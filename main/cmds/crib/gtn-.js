const Command = require('../../lib/command/Command.js');

let questions = [
	{ q: 'Any minimum possible number? `1` by default.',
		v: (msg) => Number(msg.content),
		e: 'It should be a number.'
	},

	{ q: 'Any max possible number? `100` by default.',
		v: (msg) => Number(msg.content),
		e: 'It should be a number.'
	},

	{ q: 'What should be the number to be guessed?',
		v: (msg, col) => {
			let { content } = msg;
			content = Number(content);
			if (content > col) {

			} else {
				return Number(msg.content);
			}
		},
		e: 'It should be a number and within the range of the `min` and `max` number.'
	},

	{ q: 'What\'s the prize for this event?',
		v: (msg) => Number(msg.content),
		e: 'You need a prize.'
	},

	{ q: 'Should we lock the channel after the event?',
		v: (msg) => Number(msg.content),
		e: 'Only `y` and `n`'
	},
	
]

module.exports = new Command({
	name: 'gtn-',
	aliases: ['guessthenumber-'],
	description: 'Starts a guess the number event.'
}, async ({ msg, args }) => {
	return;
});