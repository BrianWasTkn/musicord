import { Message } from 'discord.js';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('porsche', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: false,
      emoji: ':credit_card:',
      info: 'Increases your vault capacity from 20K up to 100K coins.',
      name: 'Porsche\'s Card',
      cost: 650000,
    });
  }

  async use(msg: Message): Promise<string> {
  	const { db, util } = this.client;
    const data = await db.currency.fetch(msg.author.id);
		const card = data.items.find(i => i.id === this.id);
		
		await msg.channel.send(`You have **${card.amount.toLocaleString()}** cards to craft, how many do you want? You have 10 seconds.`)
		const rep = (await msg.channel.awaitMessages(
			m => m.author.id === msg.author.id,
			{ max: 1, time: 10e3 }
		)).first();

		let choice = Number(rep.content);
		if (!Boolean(Number(choice))) {
			return 'Needs to be a number lol bye'
		}
		if (Number(choice) > card.amount) {
			return `Don't try and break me bish, you only have ${card.amount.toLocaleString()} of these.`
		}

		let gain: number[] | number = Array(choice).fill(null).map(() => util.randomNumber(2e4, 1e5));
		gain = gain.reduce((p, c) => p + c);
    card.amount -= choice;
    data.space += gain;
    await data.save();

		return `Your vault has gained **${gain.toLocaleString()}** coins by crafting ${choice.toLocaleString()} of your porsche's cards.`;
  }
}
