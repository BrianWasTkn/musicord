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
      cost: 69000000,
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
      const coins = randomNumber(5e4, 5e5);
      let items: { amt: number, item: Item }[] = [];
      let e = 0;

      while(e <= randomNumber(3, 10)) {
        const mods = this.client.handlers.item.modules.array();
        const item = randomInArray(mods.filter(m => !items.some(it => it.item.id === m.id)))
        items.push({ item, amt: randomNumber(1, item.cost <= 50e6 ? 100 : 2) });
        e++;
      }

      const its = items.map(({ amt, item }) => `**\`${amt.toLocaleString()}\` ${item.emoji} ${item.name}**`);
      items.forEach(({ amt, item }) => data.items.find(i => i.id === item.id).amount += amt);
      xplo.amount--;
      await data.save();

      return `**__${this.emoji} ${msg.author.username}'s bomb__**\n**\`${coins.toLocaleString()}\` coins**\n${its.join('\n')}`;
    }

    const fine = randomNumber(data.pocket * 0.75, data.pocket);
    const items: { amt: number, item: Item }[] = [];
    const inv = data.items.filter(i => i.amount >= 2);

    for (let e = 0 ; e < inv.length ; e++) {
      const mod = this.client.handlers.item.modules.get(inv[e].id);
      const it = data.items.find(i => i.id === mod.id);
      const amt = Math.round(it.amount / 2);
      items.push({ item: mod, amt });
    }

    const its = items.map(({ amt, item }) => `**\`${amt.toLocaleString()}\` ${item.emoji} ${item.name} LOST**`);
    items.forEach(({ amt, item }) => data.items.find(i => i.id === item.id).amount -= amt);
    xplo.amount--;
    data.pocket -= fine;
    await data.save();

    return `**${this.emoji} ${msg.author.username}'s bomb FAILED :joy:**\n \`${fine.toLocaleString()}\` coins LOST\n${its.join('\n')}`;
  }
}
