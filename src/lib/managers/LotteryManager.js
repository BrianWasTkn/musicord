import Manager from '../structures/Manager.js'

export default class LotteryManager extends Manager {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		client.on(Events.CLIENT_READY, async () => await this.handle({ 
			Bot: client
		}));
	}

	randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	async handle({ Bot }) {
		/* DevMode */
		if (Bot.config.devMode) return;

		/* Fetch */
		const Lotto = Bot.config.lottery(Bot);
		const { 
			active, winners, multiplier,
			interval, lastRoll, logs, host: { 
				guild, channel, role 
			}, prize: { min, max, limit }
		} = Lotto;

		/* Interval to check if active */
		const check = async () => {
			setTimeout(() => {

			}, 5e3);
		}
		const check = setInterval(async () => {
			if (!active) {
				return;
			} else {
				clearInterval(check);
				if (new Date().getMinutes() === 00) {
					await run();
				} else {
					return;
				}
				run();
			};
		}, 1000);

		/* Interval to Roll */
		const run = async () => {
			await roll();
			const timeout = () => {
				setTimeout(async () => {
					if (active) {
						await roll();
						timeout();
					}
				}, interval * 60 * 60 * 1000);
			}
		};

		/* Runs the first roll and proceed to interval */
		run();

		/* Roll */
		const roll = async () => {
			const members = guild.roles.cache.get(role.id).members;
			const winner = members.filter(m => !m.bot).random();

			let coins = this.randomNumber(min / 1000, max / 1000);
			coins += (Math.floor(coins * (multiplier / 100))) * 1000;
			if (coins > (limit * 1000)) coins = limit * 1000;
			
			Lotto.lastRoll = Date.now(); // TODO: able to use mongoose to save timestamps
			if (winners.has(winner.id)) {
				winners.get(winner.id).push({
					coins, timestamp: Date.now()
				});
			} else {
				winners.set(winner.id, {
					coins, timestamp: Date.now()
				});
			}

			await channel.send(super.createEmbed({
				title: 'Lottery Winner',
				icon: winner.avatarURL(),
				color: 'GOLD',
				text: `**${winner.tag}** walked away with **${(coins * 1e3).toLocaleString()}** coins.`,
				author: { text: guild.name, icon: guild.iconURL() },
				footer: { text: `Next winner in ${interval} hours.`, icon: guild.iconURL() },
				fields: {
					'Winner ID': { content: winner.id, inline: true },
					'Multiplier': {content: multiplier, inline: true },
					'Requirement':{content: role.mention, inline: true }
				}
			})).catch(error => {
				return super.log('LotteryManager@msg', error);
			})
		}
	}
}