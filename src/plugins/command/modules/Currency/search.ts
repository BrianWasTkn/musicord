import { Command, Context, LavaClient, CurrencyEntry, Inventory } from 'lava/index';
import { CollectorFilter, Message } from 'discord.js';

interface SearchData {
	place: string;
	maxCoins: number;
	minCoins: number;
	successMsg: (won: number) => string;
	items?: string[];
	death?: {
		odds: number;
		msg: string;
	}; 
}

interface SearchResult { // this is not google LOL
	coinsWon: number;
	coinsRaw: number;
	itemGot: Inventory;
}

export default class extends Command {
	constructor() {
		super('search', {
			aliases: ['search', 'scout'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 30,
			description: 'Search for coins on some places to either get some or die!',
		});
	}

	get search() {
		return search(this.client);
	}

	/**
	 * Process the search stuff.
	 * Returns `false` if dead, an object otherwise.
	 */
	searchPlace(search: SearchData, entry: CurrencyEntry, multi: number): Promise<false | SearchResult> {
		const { minCoins, maxCoins, death, items } = search;
		const { randomNumber, randomInArray } = entry.client.util;
		const coins = randomNumber(minCoins, maxCoins);
		const item = randomInArray(items ?? []);

		const isDead = death ? death.odds > randomNumber(1, 100) : false;
		if (isDead) return entry.kill().save().then(() => false);

		if (item) entry.addItem(item);
		return entry.addPocket(coins).save().then(() => ({
			itemGot: (randomNumber(1, 100) < 10) && item ? entry.items.get(item) : null,
			coinsWon: Math.round(coins + (coins * (multi / 100))),
			coinsRaw: coins
		}));
	}

	async exec(ctx: Context) {
		const { randomsInArray } = ctx.client.util;
		const entry = await ctx.currency.fetch(ctx.author.id);
		const searchables = randomsInArray(this.search, 3);
		const places = searchables.map(s => s.place);

		await ctx.reply(`**Where do you want to search?**\nPick one from the list below.\n\`${places.join('`, `')}\``);
		const choice = await ctx.awaitMessage();

		if (!choice || !choice.content || !places.some(p => choice.content.toLowerCase() === p)) {
			return ctx.reply('Imagine not picking the right place, idiot.');
		}

		const searched = searchables.find(s => choice.content.toLowerCase() === s.place);
		const getHeader = () => `${ctx.author.username} searched the ${searched.place.toUpperCase()}`;
		const multi = entry.calcMulti(ctx).reduce((p, c) => p + c.value, 0);
		const nice = await this.searchPlace(searched, entry, multi);

		if (!nice) {
			return ctx.channel.send({ embed: {
				author: { name: getHeader(), iconURL: ctx.author.avatarURL({ dynamic: true }) },
				description: searched.death.msg,
				footer: { text: 'Lol u died' },
				color: 'RED',
			}});
		}

		return ctx.channel.send({ embed: {
			description: `${searched.successMsg(nice.coinsWon)}${nice.itemGot ? `\nand **1 ${nice.itemGot.module.emoji} ${nice.itemGot.module.name}** wow you're very lucky!` : ''}`,
			footer: { text: `Multiplier: +${multi}% (${nice.coinsRaw.toLocaleString()})` },
			author: { name: getHeader(), iconURL: ctx.author.avatarURL({ dynamic: true }) },
			color: 'GREEN'
		}});
	}
}

const search = (client: LavaClient): SearchData[] => [
	{
		place: 'dustbin',
		maxCoins: 5000,
		minCoins: 1000,
		successMsg: w => `You smell but here's **${w.toLocaleString()}** coins ig`,
		death: {
			msg: 'You ate a rotten banana and went to the hospital but you were dead on arrival.',
			odds: 5,
		},
	},
	{
		place: 'air',
		maxCoins: 25000,
		minCoins: 3000,
		successMsg: w => `How the heck you got **${w.toLocaleString()}** coins from air?`,
	},
	{
		place: 'memers crib',
		maxCoins: 100000,
		minCoins: 20000,
		items: ['bacon'],
		successMsg: w => `We wanna make u rich here so here's **${w.toLocaleString()}** bits, enjoy :)`,
	},
	{
		place: 'mars',
		maxCoins: 10000,
		minCoins: 100,
		successMsg: w => `I suffocated for **${w.toLocaleString()}** coins.`
	},
	{
		place: 'discord',
		maxCoins: 10000,
		minCoins: 1000,
		successMsg: w => `You typed \`lava gimme\` in the chats and got **${w.toLocaleString()}** coins`,
		death: {
			msg: 'You got banned from your favorite server, you died.',
			odds: 10,
		}
	},
	{
		place: 'club',
		maxCoins: 20000,
		minCoins: 5000,
		successMsg: w => `Wow you danced for **${w.toLocaleString()}** coins`,
		death: {
			msg: 'Being drunk is bad and bad leads to death, you died.',
			odds: 25
		}
	}
]