import Command from '../../classes/Command'

// TODO: picked winner, react: ['thumbsup', 'reroll emoji'] to the embed
// to verify it has been paid or reroll if inactive.

export default class Lottery extends Command {
	constructor(client) {
		super(client, {
			name: 'autolotto',
			aliases: ['lottery', 'lotto', 'al'],
			description: 'Starts running the autolottery service for Memers Crib.',
			usage: '<on | off | winners>',
			cooldown: 0
		}, {
			category: 'Crib',
			user_permissions: ['MANAGE_MESSAGES'],
			client_permissions: ['EMBED_LINKS'],
			music_checks: [],
			args_required: true,
			exclusive: ['691416705917779999']
		});
	}

	randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
	}

	async execute({ Bot, msg, args }) {
		/* Vars */
		const [mode] = args;
		const Lotto = Bot.config.lottery(Bot);

		/* Modes */
		if (mode === 'on') {
			Lotto.active = true;
		} else if (mode === 'off') {
			Lotto.active = false;
		} else if (mode === 'winners') {
			/* Map */
			let fields = {};
			let map = Lotto.winners.keyArray().forEach(w => {
				let val = Lotto.winners.get(w);
				fields[w] = {
					content: `**Coins won:** ${val.coins.toLocaleString}\n**On:** ${val.timestamp}`,
					inline: true
				};
			});
			/* Message */
			await msg.channel.send(super.createEmbed({
				title: `${Lotto.winners} total winners (${Object.entries(fields).length}) shown`,
				color: 'GREEN',
				text: `These are the **${Object.entries(fields).length}** latest winners.`,
				fields: fields
			}));
		}
	}
}