import { Context, Command, LavaClient } from 'lava/index';
import { MessageEmbedOptions } from 'discord.js';

type PersonPredicate = (ctx: Context) => string;
type MessagePredicate = (won: number) => string;

interface BegCoins {
	min: number;
	max: number;
}

interface BegMessage {
	success: MessagePredicate;
	fail: string;
}

interface BegData {
	person: string | PersonPredicate;
	coins: BegCoins;
	msgs: BegMessage;
	odds: number;
}

export default class extends Command {
	constructor() {
		super('beg', {
			aliases: ['beg', 'gimme'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 10,
			description: 'Extract small amount of coins into your pocket!',
			name: 'Beg'
		});
	}

	get beg() {
		return beg(this.client);
	}

	getWon(coins: BegCoins, multi: number) {
		const { min, max } = coins;
		const raw = this.client.util.randomNumber(min, max);
		const won = Math.round(raw + (raw * (multi / 100)));
		return { raw, won };
	}

	getSuccessMsg(ctx: Context, { coins, person, msgs }: BegData, { multi, raw, won }: { multi: number, raw: number, won: number; }): MessageEmbedOptions {
		return {
			author: { name: typeof person === 'function' ? person(ctx) : person },
			footer: { text: `Multiplier Bonus: +${multi}% (${raw.toLocaleString()} coins)` },
			description: `"${msgs.success(won)}"`,
			color: 'GREEN'
		};
	}

	getFailMsg(ctx: Context, { coins, person, msgs }: BegData): MessageEmbedOptions {
		return {
			author: { name: typeof person === 'function' ? person(ctx) : person },
			footer: { text: 'Imagine begging lol' },
			description: `"${msgs.fail}"`,
			color: 'RED',
		};
	}

	async exec(ctx: Context) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		const beg = ctx.client.util.randomInArray(this.beg);
		const multi = entry.calcMulti(ctx).unlocked.reduce((p, c) => p + c.value, 0);

		if (Math.random() > beg.odds) {
			const { raw, won } = this.getWon(beg.coins, multi);
			await entry.addPocket(won).save();
			await ctx.reply({ embed: this.getSuccessMsg(ctx, beg, { multi, raw, won }) });
			return true;
		}

		return ctx.reply({ embed: this.getFailMsg(ctx, beg) }).then(() => true);
	}
}

const beg = (client: LavaClient): BegData[] => [
	{
		odds: 0.2,
		person: 'Rick Astley',
		msgs: {
			success: w => `Ok im done rickrolling, here's **${w.toLocaleString()}** coins`,
			fail: client.util.randomInArray([
				'Never gonna give you up',
				'Never gonna let you down',
				'Never gonna run around and desert you',
				'Never gonna make u cry',
				'Never gonna say goodbye',
				'Never gonna tell a lie and hurt you',
				'**Say goodbye**'
			])
		},
		coins: {
			max: 5000,
			min: 500
		},
	},
	{
		odds: 0.7,
		person: 'Elon Musk',
		msgs: {
			success: w => `Ok im rich so ima give u **${w.toLocaleString()}** coins`,
			fail: 'Go back to ur poorhole and beg to someone else'
		},
		coins: {
			max: 50000,
			min: 10000
		}
	},
	{
		odds: 0.4,
		person: 'Dua L',
		msgs: {
			success: w => `If you don't wanna see me giving **${w.toLocaleString()}** coins to somebody`,
			fail: 'Don\'t show up, don\'t beg now'
		},
		coins: {
			max: 40000,
			min: 400
		}
	},
	{
		odds: 0.65,
		person: 'Binran',
		msgs: {
			success: w => `Aww ur so poor, take my **${w.toLocaleString()}** coins`,
			fail: `The phaser gram phaser test suggests you to fuck off <3`
		},
		coins: {
			max: 100000,
			min: 10000
		}
	},
	{
		odds: 0.9,
		person: 'You in a parallel universe',
		msgs: {
			success: w => `I can give myself **${w.toLocaleString()}** coins what?`,
			fail: 'Begone thot',
		},
		coins: {
			max: 500000,
			min: 1000
		}
	}
];