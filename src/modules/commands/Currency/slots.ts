import { ColorResolvable, MessageOptions, Collection } from 'discord.js';
import { Context, ContextDatabase } from 'lib/extensions';

import { default as Constants } from 'lib/utility/constants';
import { Effects, Embed } from 'lib/utility';
import { Command, Item } from 'lib/objects';
import { Argument } from 'discord-akairo';
import config from 'config/index';

export default class Currency extends Command {
	constructor() {
		super('slots', {
			name: 'Slots',
			aliases: ['slotmachine', 'slots', 's'],
			channel: 'guild',
			description: 'Spend some amount of coins on a slot machine',
			category: 'Currency',
			cooldown: 3000,
			args: [
				{
					id: 'amount',
					type: Argument.union('gambleAmount', (_, a) => {
						if (!a) return null;
						if (a.toLowerCase() === 'table') return a.toLowerCase();
						return null;
					}),
				},
			],
		});
	}

	private get slotMachine() {
		return {
			broken_heart: [1, 3, false],
			clown: [1, 3, false],
			pizza: [1, 15, false],
			eggplant: [1, 15, false],
			flushed: [1, 10, true],
			star2: [1, 20, true],
			fire: [2, 25, true],
			four_leaf_clover: [2, 50, true],
			kiss: [2, 100, true],
		};
	}

	// this took fricking time istg
	roll(emojis: string[], oddRdce: number) {
		const { randomInArray, randomNumber } = this.client.util;
		const emoji = randomInArray(emojis);
		const odds = randomNumber(1, 150);

		function filter<A>(x: A[], comp: A): boolean {
			return !x.some((y: A) => y === comp);
		}

		function deepFilter<A>(srcArr: A[], filtArr: A[]): A[] {
			return srcArr.filter((src: A) => filter(filtArr, src));
		}

		if (odds > 145 - oddRdce) {
			return Array(3).fill(emoji);
		}
		if (odds > 110 - Math.floor(oddRdce / 2)) {
			const emjis = Array(3).fill(emoji);
			const ind = randomNumber(1, emjis.length) - 1;
			emjis[ind] = randomInArray(emojis.filter((e) => e !== emoji));
			return emjis;
		}

		let secondSlot: string;
		function map(_: string, i: number) {
			if (i === 0) return secondSlot = randomInArray(deepFilter(emojis, [emoji]));
			return randomInArray(deepFilter(emojis, [emoji, secondSlot]));
		}

		return [emoji, ...Array(2).fill(emoji).map(map)];
	}

	private table(): MessageOptions {
		const slots = Object.entries(this.slotMachine);
		const doubles = slots.filter(([k, v]) => v[2]);
		// solo wins
		const sWins = slots.map(([k, v], i) => {
			return i === slots.length - 1
				? `・ :${k}: — \`x${v[slots.length - 1]}\``
				: undefined;
		}).filter(Boolean);
		const dWins = doubles.map(([k, v]) => {
			return `・ :${k}::${k}: - \`x${v[0]}\``;
		});
		const jWins = slots.map(([k, v]) => {
			return `・ :${k}::${k}::${k}: - \`x${v[1]}\``;
		});

		return { embed: this.client.util.embed()
			.setDescription([...sWins, ...dWins, ...jWins].join('\n'))
			.setTitle(`${this.name} Table`).setColor('BLUE')
		};
	}

	/**
	 * Basically the whole thang
	 * @param _ a discord message object
	 * @param args the passed arguments
	 */
	async exec(
		ctx: Context<{ amount: number | string }>,
		userEntry: ContextDatabase
	): Promise<MessageOptions> {
		const {
			util: { effects },
		} = this.client;

		// Check Args
		const { MIN_BET, MAX_BET, MAX_POCKET } = Constants.Currency;
		const data = userEntry.data;

		// Args
		const { amount: bet } = ctx.args;
		const args = ((bet: number) => {
			let state = false;
			switch (true) {
				case data.pocket <= 0:
					return { state, m: "You don't have coins to slot!" };
				case data.pocket >= MAX_POCKET:
					return { state, m: `You're too rich (${MAX_POCKET.toLocaleString()}) to slot!` };
				case bet > data.pocket:
					return { state, m: `You only have **${data.pocket}** coins don't lie to me hoe.` };
				case !bet:
					return { state, m: 'You need something to slot!' };
				case bet < 1 || !Number.isInteger(Number(bet)):
					return { state, m: 'It has to be a real number greater than 0 yeah?' };
				case bet < MIN_BET:
					return { state, m: `You can't slot lower than **${MIN_BET}** coins sorry` };
				case bet > MAX_BET:
					return { state, m: `You can't slot higher than **${MAX_BET.toLocaleString()}** coins sorry` };
				default:
					return { state: true, m: null };
			}
		})(bet as number);
		if (!args.state && bet !== 'table') {
			return { content: args.m, replyTo: ctx.id };
		}
		if (bet === 'table') {
			return this.table();
		}

		// Item Effects
		const iSlotEffs: Item[] = [];
		let slots: number = 0;
		for (const it of ['crazy', 'brian']) {
			const userEf = effects.get(ctx.author.id);
			if (!userEf) {
				const col = new Collection<string, Effects>().set(it, new Effects());
				effects.set(ctx.author.id, col);
			}
			if (effects.get(ctx.author.id).has(it)) {
				const { modules: mods } = ctx.client.handlers.item;
				if (['crazy', 'brian'].includes(it)) iSlotEffs.push(mods.get(it));
				slots += effects.get(ctx.author.id).get(it).slotJackpotOdds;
			}
		}

		// Slot Emojis
		const emojis = Object.keys(this.slotMachine);
		const order = this.roll(emojis, slots);
		const outcome = `**>** :${order.join(':    :')}: **<**${iSlotEffs.length > 0 ? ` ${iSlotEffs.map(e => e.emoji).join(' ')}` : ''}`;
		let { length, winnings } = this.calcWinnings(bet as number, order);

		// Shit
		let description: string = '';
		let color: ColorResolvable = 'RED';
		let state: string = 'losing';

		description += outcome;
		if (length === 1 || length === 2) {
			const jackpot = length === 1;
			const { pocket } = await userEntry.addCd().addPocket(winnings).updateItems()
				.calcSpace().updateStats('won', winnings).updateQuest({ cmd: this, count: 1 })
				.updateStats('wins').save();

			color = jackpot ? (slots ? 'BLUE' : 'GOLD') : 'GREEN';
			state = jackpot ? (slots ? 'powered' : 'jackpot') : 'winning';
			description += `\n\nYou won **${winnings.toLocaleString()}**`;
			description += `\n**Multiplier** \`x${Math.round(winnings / (bet as number)).toLocaleString()}\``;
			description += `\nYou now have **${pocket.toLocaleString()}**`;
		} else {
			const { pocket } = await userEntry.addCd().removePocket(bet as number).updateItems()
				.calcSpace().updateStats('lost', bet as number).updateStats('loses').save();
			ctx.client.handlers.quest.emit('gambleLost', { cmd: this, ctx });
			color = 'RED'; state = 'losing';
			description += `\n\nYou lost **${bet.toLocaleString()}**`;
			description += `\nYou now have **${pocket.toLocaleString()}**`;
		}

		// Final Message
		return {
			embed: {
				color, description, author: {
					name: `${ctx.author.username}'s ${state} slot machine`,
					icon_url: ctx.author.avatarURL({ dynamic: true })
				},
			}
		};
	}

	calcWinnings(bet: number, slots: string[]) {
		const { slotMachine } = this;
		const rate: (number | boolean)[][] = Object.values(slotMachine);
		const emojis: string[] = Object.keys(slotMachine);

		// ty daunt
		const length = slots.filter((thing, i, ar) => ar.indexOf(thing) === i)
			.length;
		const won: (number | boolean)[][] = rate
			.map((_, i, ar) => ar[emojis.indexOf(slots[i])])
			.filter(Boolean); // mapped to their index
		const [multi] = won.filter((ew, i, a) => a.indexOf(ew) !== i);

		// Win or Jackpot
		if (length === 1 || length === 2) {
			let index = length === 1 ? 1 : 0; // [prop: string]: [number, number]
			let multiplier = multi[index] as number; // [number, number][0]

			// Doubles
			if (!multi[2] && length === 2) {
				// Contains the very last emoji
				if (slots.some((s) => s === emojis[emojis.length - 1])) {
					return { length: 2, winnings: bet };
				}

				// Blacklisted Doubles
				return { length: 3, winnings: 0 };
			}

			// Jackpots
			let winnings = Math.round(bet * multiplier);
			return { length, winnings };
		}

		// Contains one last emoji
		if (slots.some((s) => s === emojis[emojis.length - 1])) {
			return { length: 2, winnings: bet };
		}

		// Lost
		return { length, winnings: 0 };
	}
}
