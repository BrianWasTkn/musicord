import { MessagePlus } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('porsche', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':credit_card:',
      info: 'Increases your vault capacity from 5K up to 30K coins.',
      name: "Porsche's Card",
      cost: 1300000,
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const { util } = this.client;
    const data = await msg.author.fetchDB();
    const card = data.items.find((i) => i.id === this.id);

    const m = `${msg.author.toString()} You have ${card.amount.toLocaleString()} cards. How many cards do you wanna reveal right now?`;
    await msg.channel.send(m);
    const f = (m) => m.author.id === msg.author.id;
    const rep = (await msg.channel.awaitMessages(f, { max: 1, time: 15000 })).first();

    if (!rep) return 'lol bye, thanks for nothing.';
    let choice = Number(rep.content);
    if (!Boolean(Number(rep.content)))
      return 'Needs to be a number bruh';
    if (choice > card.amount)
      return `Don't try and break me bish, you only have ${card.amount.toLocaleString()} of these.`;

    let gain: number[] | number;
    gain = Array(choice).fill(null).map(() => util.randomNumber(5e3, 3e4)).reduce((p, c) => p + c);
    card.amount -= choice;
    data.space += gain;
    await data.save();

    return `**You crafted __${choice.toLocaleString()}__ cards into your vault.**\nThis brings you to **${data.space.toLocaleString()}** of total vault capacity, with **${gain.toLocaleString()} (${Math.round(gain / choice).toLocaleString()} average) ** being crafted.`;
  }
}
