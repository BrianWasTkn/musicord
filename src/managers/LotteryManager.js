import Manager from '../classes/Manager.js'

export default class LotteryManager extends Manager {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.CLIENT_READY, async () => await this.handle({ 
			Bot: client
		}));
	}

	async handle({ Bot }) {
		/* Fetch */
		const Lotto = Bot.config.lottery(Bot);
		const { 
			active, winners, multiplier,
			interval, prize, lastRoll, host: { 
				guild, channel, role 
			}
		} = Lotto;

		/* Interval to check if active */
		const check = setInterval(async () => {
			if (!active) {
				return;
			} else {
				clearInterval(check);
				await interval();
			};
		}, 1000);

		/* Interval to Roll */
		const interval = async () => {
			setInterval(async () => {
				if (active) {
					await roll();
				}
			}, interval * 60 * 60 * 1000);
		}

		/* Roll */
		const roll = async () => {
			/* Filter */
			const members = guild.roles.cache.get(role.id).members;
			const winner = members.filter(m => !m.bot).random();
			/* Prize */
			let coins = randomNumber(prize.min, prize.max);
			coins = coins + (Math.floor(coins * (multiplier / 10))); // Apply multiplier
			/* Limit */
			if (coins > (prize.limit * 1000)) {
				coins = prize.limit * 1000;
			}
			/* Set */
			Lotto.winners += 1;
			Lotto.lastRoll = Date.now(); // TODO: able to use mongoose to save timestamps
			winners.set(winner.id, {
				coins: coins * 1000,
				timestamp: Date.now()
			});
			/* Message */
			try {
				await channel.send(super.createEmbed({
					author: {
						text: `${guild.name} — Auto Lottery`,
						icon: guild.iconURL()
					},
					title: 'Lottery Winner',
					icon: winner.avatarURL(),
					color: 'GOLD',
					text: `**${winner.tag}** walked away with **${(coins * 1000).toLocaleString()} coins!`,
					fields: {
						'Winner ID': {
							content: winner.id,
							inline: true
						},
						'Multiplier': {
							content: `${multiplier}%`,
							inline: true
						},
						'Requirement': {
							content: role.mention,
							inline: true
						}
					},
					footer: {
						text: `Next winner in: ${interval} hours.`
						icon: winner.avatarURL()
					}
				}));
			}
		}

		/* Random Number */
		const randomNumber = (min, max) => {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}
	}
}