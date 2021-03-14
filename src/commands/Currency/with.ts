import { Message, GuildMember, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Currency extends Command {
	constructor() {
		super('with', {
			aliases: ['withdraw', 'with', 'take'],
			channel: 'guild',
			description: "Withdraw coins from your vault.",
			category: 'Currency',
			cooldown: 1e3,
			args: [
				{
					id: 'amount',
					type: async (msg: Message, phrase: number | string) => {
						const data = await this.client.db.currency.fetch(msg.author.id);
						if (!phrase) {
							await msg.channel.send('You need something to deposit')
							return null;
						}

						if (data.vault < 1) {
							await msg.channel.send('You have nothing to withdraw');
							return null;
						}

						let withd: number;
						if (Boolean(Number(phrase))) {
							withd = Number(phrase);
						} else {
							if (phrase === 'all' || phrase === 'max') {
								withd = data.vault;
							} else if (phrase === 'half') {
								withd = Math.round(data.vault / 2);
							}
						}

						return withd;
					}
				},
			],
		});
	}

	public async exec(
		_: Message,
		{
			amount,
		}: {
			amount: number;
		}
	): Promise<string | MessageOptions> {
		const { fetch, add, remove } = this.client.db.currency;
		const { pocket, vault, space } = await fetch(_.author.id);
		const embed: Embed = new Embed();

		if (amount > vault) {
			return `Bro, you only have ${vault.toLocaleString()} coins in your vault what're you up to?`
		}

		await add(_.author.id, 'pocket', amount);
		await remove(_.author.id, 'vault', amount);
		return `**${amount.toLocaleString()}** coins withdrawn.`
	}
}
