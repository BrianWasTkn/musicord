import { ItemOptions, ItemReturn } from 'lib/interface/handlers/item';
import { Context } from 'lib/extensions/message';
import { Item } from '..';

interface BoxOptions extends ItemOptions {
	contents?: {
		coins?: [number, number];
		keys?: number;
	}
}

type PushedItem = { amt: number, item: Item };

export class Box extends Item {
	contents: BoxOptions['contents'];
	constructor(id: string, {
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

	async use(ctx: Context): Promise<ItemReturn> {
		const { util: { sleep, randomNumber, randomInArray }, db: { currency: { utils } } } = ctx.client;
		const modules = [...this.handler.modules.values()];
		const random = (arr: Item[], filter: (item: Item) => boolean) => {
			const items = arr.filter(filter);
			return randomInArray(items);
		};

		await ctx.send({ replyTo: ctx.id, content: `**${this.emoji} Opening your ${this.name}...**` })
		const items: PushedItem[] = [{ amt: 1, item: random(modules, i => i.cost >= 1e5) }];
		const { coins: cCoins, keys: kKeys } = this.contents;
		const multi = utils.calcMulti(ctx, ctx.db.data);
		let coins = randomNumber(cCoins[0], cCoins[1]);
		let keys = kKeys + (kKeys * (multi.total / 100));

		const itemTiers = modules.filter(mod => mod.tier === this.tier);
		const tiers = { 1: [10, 1000], 2: [10, 500], 3: [10, 50] };

		for (let i = 0; i < randomNumber(1, itemTiers.length); i++) {
			const item = randomInArray(itemTiers.filter(mod => !items.some(i => i.item.id === mod.id)));
			const amt = randomNumber(tiers[item.tier][0], tiers[item.tier][1]);
			items.push({ amt, item: item[0] });
		}

		let contents = `\`${coins.toLocaleString()}\` :coin: coins`;
		contents += `\n\`${keys.toLocaleString()}\` :key: keys`;
		contents += `\n${items.map(({ amt, item: { emoji, name } }) => {
			return `\`${amt.toLocaleString()}\` ${emoji} ${name}`;
		}).join('\n')}`;

		await Promise.all(items.map(({ amt, item }) => ctx.db.addInv(item.id, amt).save()));
		await ctx.db.addPocket(coins).addPremiumKeys(keys).updateItems().save();
		await sleep(randomNumber(2, 10) * 1e3);
		return { content: `**__${this.emoji} ${this.name} contents for ${ctx.author.username}__**\n${contents}` };
	}
}