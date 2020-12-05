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

			/* Interval */
			const interval = () => {
				setInterval(async () => {
					if (Lotto.active) {
						await roll();
					} else {
						return;
					}
				}, Lotto.interval);
			}

			/* Trigger */
			interval();

			/* Roll */
			const roll = async () => {
				/* Find a random member from the required role */
				const random = Lotto.host.guild.roles.cache
				.filter(role => role.id === Lotto.host.role.id)
				.members.random();

				/* if Bot */
				if (random.bot) return roll();
					
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
					icon: 
				}))
			}
			/* Set */
			Lotto.active = !Lotto.active;
			/* Message */
			await msg.channel.send(super.createEmbed({
				title: 'Lottery Deactivated',
				color: 'GRAY',
				icon: msg.guild.iconURL(),
				text: 'The lottery for this guild has been deactivated.'
			}));
		} else if (mode === 'winners') {
			/* Map */
			const fields = {};
			const map = Lotto.winners.keyArray().forEach(w => {
				obj[w] = Lotto.winners.get(w);
			});
			/* Message */
			await msg.channel.send(super.createEmbed({
				title: `${Lotto.winners} total winners (${Object.entries(fields).length}) shown`,
				color: 'GREEN',
				text: 'Please take note that these are the latest winners.',
				fields: fields
			}));``
		}
	}
}