import Command from '../../classes/Command'

export default class Phone extends Command {
	constructor(client) {
		super(client, {
			name: 'math',
			aliases: ['challenge'],
			description: 'Just a fun math command, answer 10 questions and see your results.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Crib'
			exclusive: ['691416705917779999']
		});
	}

	async execute({ Bot, msg }) {
		/* Prepare */
		let lives = 10;
		let question = [Math.random() * 10, Math.random() * 10]
		.map(math => Math.floor(math));

		/* A func to repeat awaiting messages */
		const ask = async (question, lives) => {
			/* Lives */
			if (lives < 1) {
				await end();
			}

			/* Ask */
			const answer = await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {
				time: 1e4,
				max: 1,
				errors: ['time']
			});

			/* chk */
			if (!answer.first()) {
				await end(true);
			}
		}
	}
}