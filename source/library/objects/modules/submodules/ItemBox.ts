import { Context } from 'lib/extensions';
import { Item } from '../..';

interface BoxOptions extends Constructors.Modules.Item {
	contents?: {
		coins?: [number, number];
		tiers?: [number, number];
		keys?: number;
	}
}

/**
 * Represents a Box Item.
 * @absract @extends {Item}
*/
export abstract class Box extends Item {
	public contents: BoxOptions['contents'];
	public constructor(id: string, {
		category = 'Boxes',
		sellable = true,
		buyable = true,
		premium = true,
		usable = true,
		emoji = ':package:',
		checks = [],
		contents = {},
		name, tier, cost, info
	}: Partial<BoxOptions>) {
		super(id, {
			category,
			sellable,
			buyable,
			premium,
			usable,
			checks,
			emoji,
			name,
			tier,
			cost,
			info
		});

		this.contents = contents;
	}

	public async use(ctx: Context, times: number): Promise<Handlers.Item.UseReturn> {
		const { util: { sleep, randomNumber, randomInArray }, db: { currency: { utils } } } = ctx.client;
		const modules = [...this.handler.modules.values()];
		const random = (arr: Item[], filter: (item: Item) => boolean) => {
			const items = arr.filter(i => !i.premium).filter(filter);
			return randomInArray(items);
		};

		await ctx.channel.send({ reply: { messageReference: ctx.id, failIfNotExists: false }, content: `**${this.emoji} Opening your ${this.name}...**` })
		const tiers: { [t: string]: [number, number] } = { 1: [10, 100], 2: [10, 50], 3: [5, 10] };
		const items: Item[] = [random(modules, i => i.cost >= 1e5)];
		const amounts: number[] = [randomNumber.apply(null, tiers[items[0].tier] as [number, number])];

		const { coins: cCoins, keys: kKeys, tiers: tTiers } = this.contents;
		const multi = utils.calcMulti(ctx, ctx.db.data);
		let coins = randomNumber(cCoins[0], cCoins[1]);
		let keys = kKeys + (kKeys * (multi.total / 100));
		coins *= times; keys *= times;

		const itemTiers = modules.filter(mod => mod.tier === randomInArray(tTiers));
		for (let t = 0; t < times; t++) {
			for (let i = 0; i < randomNumber(1, itemTiers.length); i++) {
				const item = randomInArray(itemTiers.filter(mod => !mod.premium).filter(mod => !items.some(i => i.id === mod.id)));
				const amt = randomNumber.apply(null, tiers[item.tier]);
				items.push(item); amounts.push(amt);
			}
		}

		let contents = `\`${coins.toLocaleString()}\` :coin: coins`;
		contents += `\n\`${Math.round(keys).toLocaleString()}\` :key: keys`;
		contents += `\n${Array(items.length).fill(null).map((_, i) => {
			const amt = amounts[i], { emoji, name } = items[i];
			return `\`${amt.toLocaleString()}\` ${emoji} ${name}`;
		}).join('\n')}`;

		Array(items.length).fill(null).forEach((_, i) => ctx.db.addInv(items[i].id, amounts[i]));
		await ctx.db.removeInv(this.id).addPocket(coins).addPremiumKeys(Math.round(keys)).updateItems().save();
		await sleep(randomNumber(2, 5) * 1e3);
		return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `**__${this.emoji} ${this.name} contents for ${ctx.author.username}__**\n${contents}` };
	}
}

export default Box;