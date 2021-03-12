import type { Message } from 'discord.js'
import type { Item } from '@lib/handlers/item'
import type { Lava } from '@lib/Lava'

export const argTypes = (bot: Lava) => ({

	'shopItem': (msg: Message, phrase: string): Item | null => {
		const items = bot.handlers.item.modules;
		const item = items.get(phrase.toLowerCase()) || items.find(i => {
			return i.id.toLowerCase().includes(phrase.toLowerCase());
		});

		return item.id ? item : null;
	},

	'gambleAmount': async (msg: Message, phrase: string | number): Promise<number | null> => {
		const { minBet, maxBet, maxPocket } = bot.config.currency;
		const { pocket } = await bot.db.currency.fetch(msg.author.id);
		let bet = phrase;

		if (!bet) {
			await msg.channel.send('You need something to gamble!');
			return null;
		}

		if (!Boolean(Number(bet as number))) {
			bet = (bet as string).toLowerCase();
			if (bet === 'all')
				return pocket;
			else if (bet === 'half')
				return Math.round(pocket / 2);
			else if (bet === 'max')
				return pocket > (maxBet as number) ? maxBet as number : pocket;
			else if (bet === 'min')
				return minBet as number
			else if (bet.toLowerCase().endsWith('k'))
				return Number(bet.toLowerCase().replace('k', '000'))
			else {
				await msg.channel.send('You actually need a number to bet...');
				return null;
			}
		}

		return Number(bet);
	}
});