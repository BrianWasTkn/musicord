import Manager from '../classes/Manager'

export default class CooldownManager extends Manager {
	constructor(client) {
		super(client);
		/* Handle */
		const { Constants: Events } = require('discord.js');
		this.handle();
	}

	_rateLimits() {
		command._rateLimits = (user.id, {
			uses: number,
			end: Date
		});
	}

	async handle() {
		/* Cooldown */
		this.client.on('command', async (msg, command) => {
			// fetch
			const ratelimits = command._rateLimits.get(msg.author.id);
			// check
			if (!ratelimits) {
				command._rateLimits.set(msg.author.id, {
					uses: 1,
					end: Date.now() + command.cooldown
				});
			} else {
				// check if already ratelimited
				if (ratelimits.uses > command.rateLimit) {
					return msg.channel.send(super.createEmbed({
						title: 'You are being rate limited!',
						color: 'RED',
						text: `You already have **${ratelimits.uses}** uses within **${command.cooldown / 1000}** seconds, calm down.`,
						footer: {
							text: `Thanks for using ${this.client.user.username}!`,
							icon: this.client.user.avatarURL()
						}
					}));
				} else {
					const newVals = command._rateLimits.set(msg.author.id, {
						uses: ratelimits.uses++,
						end: ratelimits.end
					});
				}
			}
		});
	}
}