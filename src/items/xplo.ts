import { MessagePlus } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('xplo', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':bomb:',
      info: 'Risk your current progress for a massive surprise.',
      name: "Xplosive's Bomb",
      cost: 690000,
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const { randomNumber, randomInArray, sleep } = this.client.util;
    const data = await msg.author.fetchDB();
    const xplo = data.items.find((i) => i.id === this.id);

    await msg.channel.send({
      content: `**${this.emoji} Fusing your bomb...**`,
      replyTo: msg.id,
    });
    await sleep(randomNumber(5, 10) * 1e3);
    let odds = randomNumber(1, 100);

    if (odds >= 60) {
      const items: { amt: number; item: Item }[] = [];
      const coins = randomNumber(5e6, 100e6);
      const mods = this.client.handlers.item.modules.array();
      const rate = randomNumber(1, 200);

      let e = 0;
      while (e <= randomNumber(3, mods.length)) {
        const item = randomInArray(
          mods.filter((m) => ![...items, { 
            amt: 0, item: mods.find(i => i.id === xplo.id) 
          }].some((it) => it.item.id === m.id))
        );

        const inv = data.items.find(i => i.id === item.id);
        const amt = inv.amount + Math.round(inv.amount * (rate / 100));
        items.push({ item, amt });

        e++;
      }

      const its = items
        .sort((a, b) => b.amt - a.amt)
        .map(({ amt, item }) => `**${item.emoji} ${item.name}**`);
      items.forEach(({ amt, item }) => {
        data.items.find((i) => i.id === item.id).amount += amt
      });

      xplo.amount--;
      await msg.author.initDB(data).addPocket(coins).updateItems().db.save();

      return `**__${this.emoji} ${msg.author.username}'s bomb__**\n**You got \`${coins.toLocaleString()}\` coins and got \`+${rate}%\` of these items into your inventory:**\n\n**${its.join('**\n**')}**`;
    }

    const fine = randomNumber(1, data.pocket);
    const items: { amt: number; item: Item }[] = [];
    const inv = data.items.filter((i) => i.amount >= 2);
    const rate = randomNumber(1, 100);

    for (let e = 0; e < inv.length; e++) {
      const mod = this.client.handlers.item.modules.get(inv[e].id);
      const it = data.items.find((i) => i.id === mod.id);
      const amt = Math.round(it.amount * (rate / 100));
      items.push({ item: mod, amt });
    }

    const its = items
      .sort((a, b) => b.amt - a.amt)
      .map(({ amt, item }) => `${item.emoji} ${item.name}`);
    items.forEach(({ amt, item }) => {
      data.items.find((i) => i.id === item.id).amount -= amt;
    });

    xplo.amount--;
    data.pocket -= fine;
    await msg.author.initDB(data).updateItems().db.save();

    return `**${this.emoji} ${msg.author.username}'s bomb FAILED :skull:**\n**You got fined \`${fine.toLocaleString()}\` coins and lost \`${rate}%\` of these items from your inventory**\n\n**${its.join('**\n**')}**`;
  }
}
