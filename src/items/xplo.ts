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

    await msg.channel.send(`**${this.emoji} Fusing your bomb...**`);
    await sleep(randomNumber(5, 10) * 1e3);
    let odds = randomNumber(1, 100);

    if (odds >= 60) {
      const mods = this.client.handlers.item.modules.array();
      const coins = randomNumber(5e4, 5e5);
      let items: { amt: number, item: Item }[] = [];
      let e = 0;

      while(e <= randomNumber(3, mods.length)) {
        const item = randomInArray(mods.filter(m => !items.some(it => it.item.id === m.id)))
        items.push({ item, amt: randomNumber(1, item.cost <= 5e6 ? 50 : 3) });
        e++;
      }

      const its = items.sort((a, b) => b.amt - a.amt).map(({ amt, item }) => `**__${amt.toLocaleString()}__ ${item.emoji} ${item.name}**`);
      items.forEach(({ amt, item }) => data.items.find(i => i.id === item.id).amount += amt);
      xplo.amount--;
      await msg.author.initDB(data).updateItems().db.save();

      return `**__${this.emoji} ${msg.author.username}'s bomb__**\n**\`${coins.toLocaleString()}\` coins**\n\n${its.join('\n')}`;
    }

    const fine = randomNumber(1, data.pocket);
    const items: { amt: number, item: Item }[] = [];
    const inv = data.items.filter(i => i.amount >= 2);

    for (let e = 0 ; e < inv.length ; e++) {
      const mod = this.client.handlers.item.modules.get(inv[e].id);
      const it = data.items.find(i => i.id === mod.id);
      const amt = randomNumber(1, it.amount);
      items.push({ item: mod, amt });
    }

    const its = items.sort((a, b) => b.amt - a.amt).map(({ amt, item }) => `**__${amt.toLocaleString()}__ ${item.emoji} ${item.name}**${amt > 1 ? 's' : ''} lost :skull:`);
    items.forEach(({ amt, item }) => data.items.find(i => i.id === item.id).amount -= amt);
    xplo.amount--;
    data.pocket -= fine;
    await msg.author.initDB(data).updateItems().db.save();

    return `**${this.emoji} ${msg.author.username}'s bomb FAILED :skull:**\n**\`${fine.toLocaleString()}\` coins fined**\n\n${its.join('\n')}`;
  }
}
