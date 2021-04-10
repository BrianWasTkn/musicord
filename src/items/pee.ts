import { MessagePlus } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { Item } from '@lib/handlers/item';

export default class Flex extends Item {
  constructor() {
    super('pee', {
      category: 'Flex',
      sellable: false,
      buyable: true,
      usable: true,
      emoji: ':baby_bottle:',
      name: "Jenni's Piss",
      cost: 1e6,
      info: {
        short: "Use it to surprise somebody!",
        long: 'Send a bag of jenni\'s yellow substance to stinkingly surprise someone!'
      }
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const data = await msg.author.fetchDB();
    const piss = data.items.find(i => i.id === this.id);

    msg.channel.send(`You have ${piss.amount.toLocaleString()} baby bottles of jenni's piss, how many do you wanna give to someone?`);
    const f = (m: MessagePlus) => m.author.id === msg.author.id;
    const rep = (await msg.channel.awaitMessages(f, { max: 1, time: 15000 })).first();
    if (!rep.content || !Number.isInteger(Number(rep.content))) {
      return 'It\'s gotta be a real number yeah?';
    }

    let choice = Number(rep.content);
    if (choice > piss.amount) {
      return 'Lol imagine having way less than what you actually wanted to give';
    }

    msg.channel.send('Now tell me who the frick you want me to surprise.');
    const rep2 = (await msg.channel.awaitMessages(f, { max: 1, time: 15000 })).first();
    const meb = this.client.util.resolveMember(rep2.content, msg.guild.members.cache, false);
    if (!meb) {
      return 'Bro imagine not surprising anyone, that\'s so sad :(';
    }

    const mebData = await (meb.user as UserPlus).fetchDB();
    const mebInv = mebData.items.find(piss => piss.id === this.id);

    mebInv.amount += choice;
    piss.amount -= choice;
    await data.save();
    await mebData.save();

    return `Alright, ${meb.user.username} got your stinking surprise :kiss:`;
  }
}
