import Command from '../../classes/Command'

export default class Lottery extends Command {
	constructor(client) {
		super(client, {
			name: 'autolotto',
			aliases: ['lottery', 'lotto', 'al'],
			description: 'Starts running the autolottery service for Memers Crib.',
			usage: '<on | off | winners>',
			cooldown: 0
		}, {
			category: 'Crib'
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

			/* State */
			if (Lotto.active) {
				return msg.channel.send(super.createEmbed({
					title: 'Still Active',
					color: 'RED',
					text: 'It\'s still active bro, kalm down.'
				}));
			}

			if (!Lotto.lastRoll) {
				Lotto.lastRoll = Date.now();
				await interval();
				await msg.channel.send('The lottery has been opened for the first time.');
			} else {
				/* Check if: (now - lastRoll) > interval */
				if ((Date.now() - Lotto.lastRoll) > (1000 * 60 * 60 * Lotto.interval)) {
					Lotto.lastRoll = Date.now();
					await interval();
					await msg.channel.send('Successfully re-opened the lottery.');
				} else {
					await msg.channel.send(`Please take note that the lottery has **${Date.now() - Lotto.lastRoll}** hours left before another roll.`);
				}
			}

			/* Interval */
			const interval = async () => {
				setInterval(async () => {
					if (Lotto.active) {
						if ((Date.now() - Lotto.lastRoll) < (1000 * 60 * 60 * Lotto.interval)) {
							return;
						} else {
							await roll();
						}
					} else {
						return;
					}
				}, Lotto.interval * 1000 * 60 * 60);
			}

			/* Roll */
			const roll = async () => {
				/* Find a random member from the required role */
				const random = Lotto.host.guild.roles.cache
				.filter(role => role.id === Lotto.host.role.id)
				.members.random();

				/* if Bot */
				if (random.bot) return await roll();
					
				/* Amount */
				const amount = this.randomNumber(Lotto.prize.min, Lotto.prize.max);

				/* Push in collection */
				Lotto.winners.set(random.id, {
					user: random,
					coins: amount,
					timestamp: Date.now()
				});

				/* Send */
				await Lotto.host.channel.send(super.createEmbed({
					title: 'We have a winner!',
					color: 'GOLD',
					text: `${random.mention} walked away with **${(amount * 1000).toLocaleString()}** coins.`,
					author: { 
						text: msg.guild.name, 
						icon: msg.guild.iconURL()
					},
					footer: {
						text: random.id,
						icon: random.avatarURL()
					}
				}));
			}
		} else if (mode === 'off') {
			/* Check */
			if (!Lotto.active) {
				return msg.channel.send(super.createEmbed({
					title: 'Already Inactive',
					color: 'RED',
					text: `Autolottery is already inactive, ${Math.random() > 0.5 ? 'step' : ''}bro.`,
					footer: {
						text: '<- Lol look at this face',
						icon: msg.author.avatarURL()
					}
				}));
			}
			/* Set */
			Lotto.active = false;
			/* Message */
			await msg.channel.send(super.createEmbed({
				title: 'Lottery Deactivated',
				color: 'GRAY',
				icon: msg.guild.iconURL(),
				text: 'The lottery for this guild has been deactivated.'
			}));
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