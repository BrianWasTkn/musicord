const { Command } = require('discord-akairo');

module.exports = class Crib extends Command {
	constructor() {
		super('guess', {
			aliases: ['guess'],
			category: 'Crib',
			channel: 'guild',
			cooldown: 5000,
			rateLimit: 1,
			args: [
				{ id: 'int', type: 'number' }
			]
		});
	}

	async exec(message, args) {
		const { channel } = message;
		let { int } = args;

		if (!int) int = 10;
		if (int < 10) { 
			return message.reply('Bruh, only 10 and above ty.');
		}
		if (int > 100) { 
			return message.reply('Well no, only a hundred and below please.');
		}

		const random = this.client.util.random('num', { min: 1, max: int });
		let attempts = 2 + Math.round(random / 10);
		let hints = Math.floor(attempts / 2);
		message.reply([
			[
				`You've got **${attempts}** attempt${attempts > 1 ? 's' : ''} to try and guess`,
				`my random number between **1 and ${int}**.`,
			].join(' '),
			'You can type `end` anytime to end, or `hint` to find how high or low your last number was.'
		].join('\n'));

		const guess = async lastNumber => {
			let msg;
			let reply = await channel.awaitMessages(m => {
				return m.author.id === message.author.id;
			}, {
					max: 1, time: 15000
			});

			if (!reply || !reply.first()) {
				return channel.send('alright, no game i guess.');
			}

			reply = reply.first();
			// End
			if (reply.content.toLowerCase() === 'end') {
				return channel.send('lol ok. you ended the game.');
			}

			// Hint
			if (reply.content.toLowerCase() === 'hint') {
				if (!lastNumber) {
					channel.send('You actually wanna make an attempt first, though.');
				} else if (hints < 1) {
					channel.send('You ran out of hints, sucks to suck.');
				} else {
					channel.send([
						`Your last number (**${lastNumber}**) was too **${random - lastNumber > 0 ? 'high' : 'low'}**.`,
						`You've got \`${attempts}\` attemp${attempts > 0 ? 's' : ''} left and \`${hints -= 1}\` hint${hints === 1 ? '' : 's'} left.`
					].join('\n'));
				}
				return guess(lastNumber);
			}

			const picked = Number(reply.content);
			if (picked === random) {
				return channel.send(`Wow, you got the number right! I was thinking of **${random}** too yk.`);
			}
			if (attempts <= 1) {
				return channel.send([
					'Unlucky, you ran out of attempts so it\'s game over for you.',
					`The number was **${random}** btw.`
				].join('\n'));
			}

			if (!picked || !Number.isInteger(picked)) {
				msg = `Bruh, It's gotta be a valid number between \`1\` and \`${int}\`, bro.`;
			} else if (picked > int || picked < 1) {
				msg = `Are you serious? It's gotta be a number only between \`1\` and \`${int}\`.`;
			} else {
				msg = 'Not this time, ';
			}

      channel.send(`${msg}\`${attempts -= 1}\` attempt${attempts === 1 ? '' : 's'} left and \`${hints}\` hint${hints === 1 ? '' : 's'} left.`);
      await guess(picked);
		}

		await guess();
	}
}
