import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('xplo', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':bomb:',
      name: "Xplosive's Bomb",
      cost: 100000,
      info: {
        short: 'Get sweet treats by giving a fuck about everything!',
        long:
          'Get a free item by risking what you earned so far from your whole progress.',
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
    const { randomNumber, randomInArray, sleep } = this.client.util;
    const entry = await ctx.db.fetch();
    const data = entry.data;
    const xplo = super.findInv(data.items, this);

    await ctx.send({
      content: `**${this.emoji} Fusing your bomb...**`,
      replyTo: ctx.id,
    });

    await sleep(randomNumber(1, 5) * 1e3);
    let odds = randomNumber(1, 100);

    if (odds >= 60) {
      const mods = this.client.handlers.item.modules
        .array()
        .filter((i) => i.cost >= 1e6);
      const items: { amt?: number; item?: Item }[] = [{ amt: 1, item: this }];
      const coins = randomNumber(1, 10) * 1e6;

      xplo.amount--;
      let e = 0;

      while (e <= randomNumber(1, 3)) {
        e++;
        items.push({
          amt: randomNumber(1, 5),
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
          entry.addInv(item.id, amt);
          return `\`${amt.toLocaleString()}\` ${item.emoji} ${item.name}`;
        });

      await entry.addPocket(coins).updateItems().save();
      return { content: `**__:slight_smile: Bomb contents for ${ctx.author.toString()}__**\n${[
        `\`${coins.toLocaleString()} coins\``,
        ...its,
      ].join('\n')}` };
    }

    // Punishment: Clean one item from their inv and their pocket
    const inv = randomInArray(data.items.filter(i => i.amount > 1));
    const item = this.client.handlers.item.modules.get(inv.id);
    await entry.removePocket(data.pocket).removeInv(this.id).removeInv(item.id, super.findInv(data.items, item as Item).amount).updateItems().save();
    return { content: `**LMAO you died from the bomb!**\nYou lost your WHOLE pocket and ALL your ${item.name.slice(
      0,
      item.name.endsWith('y') ? -1 : undefined
    )}${item.name.endsWith('y') ? 'ies' : 's'} from your inventory.` };
  }
}
