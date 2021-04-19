import { Context } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('xplo', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':bomb:',
      name: "Xplosive's Bomb",
      cost: 694200,
      info: {
        short: 'Get sweet treats by giving a fuck about everything!',
        long:
          'Get a free item by risking what you earned so far from your whole progress.',
      },
    });
  }

  async use(ctx: Context): Promise<string> {
    const { randomNumber, randomInArray, sleep } = this.client.util;
    const { data } = await ctx.db.fetch();
    const xplo = this.findInv(data.items, this);

    await ctx.send({
      content: `**${this.emoji} Fusing your bomb...**`,
      replyTo: ctx.id,
    });

    await sleep(randomNumber(1, 5) * 1e3);
    let odds = randomNumber(1, 100);

    if (odds >= 60) {
      const mods = this.client.handlers.item.modules
        .array()
        .filter((i) => i.cost >= 5e6);
      const items: { amt: number; item: Item }[] = [];
      const coins = randomNumber(10, 100) * 1e6;

      xplo.amount--;
      let e = 0;

      while (e <= randomNumber(1, 3)) {
        e++;
        items.push({
          amt: randomNumber(1, 15),
          item: randomInArray(
            mods.filter((m) => {
              return !items.some((it) => it.item.id === m.id);
            })
          ),
        });
      }

      const its = items
        .sort((a, b) => b.amt - a.amt)
        .map(({ amt, item }) => {
          data.items.find((i) => i.id === item.id).amount += amt;
          return `\`${amt.toLocaleString()}\` ${item.emoji} ${item.name}`;
        });

      await ctx.db.addPocket(coins).updateItems().save();
      return `**__:slight_smile: Bomb contents for ${ctx.author.toString()}__**\n${[
        `\`${coins.toLocaleString()} coins\``,
        ...its,
      ].join('\n')}`;
    }

    // Punishment: Clean one item from their inv and their pocket
    const inv = randomInArray(data.items);
    const item = this.client.handlers.item.modules.get(inv.id);
    inv.amount = 0;
    xplo.amount--;

    await ctx.db.removePocket(data.pocket).updateItems().save();
    return `**LMAO you died from the bomb!**\nYou lost your WHOLE pocket and ALL your ${item.name.slice(
      0,
      item.name.endsWith('y') ? -1 : undefined
    )}${item.name.endsWith('y') ? 'ies' : 's'} from your inventory.`;
  }
}
