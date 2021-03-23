import { ColorResolvable, Message, MessageOptions, Collection } from 'discord.js';
import { Argument } from 'discord-akairo';
import { Document } from 'mongoose';

import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { InventorySlot } from '@lib/interface/handlers/item';
import { Command } from '@lib/handlers/command';
import { Effects } from '@lib/utility/effects';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('slots', {
      aliases: ['slotmachine', 'slots', 's'],
      channel: 'guild',
      description: 'Spend some amount of coins on a slot machine',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'amount',
          type: 'gambleAmount',
        },
      ],
    });
  }

  private get slotMachine() {
    return {
      middle_finger: [1, 2],
      clown: [1, 2],
      eyes: [1, 2],
      eggplant: [2, 15],
      alien: [2, 20],
      peach: [2, 25],
      flushed: [3, 50],
      star2: [15, 75],
      fire: [25, 750],
    };
  }

  async before(msg: Message) {
    const { effects } = this.client.util;
    const data = await this.client.db.currency.fetch(msg.author.id);
    const items = this.client.handlers.item.modules.array();
    const eff = new Effects();
    
    for (const item of items) {
      const inv = data.items.find(i => i.id === item.id);
      if (inv.expire > Date.now()) {
        if (item.id === 'brian') eff.setWinnings(0.5).setSlotOdds(5);
        if (item.id === 'thicc') eff.setWinnings(0.5);
        if (item.id === 'crazy') eff.setSlotOdds(5);
        const temp = new Collection<string, Effects>();
        temp.set(item.id, new Effects());
        if (!effects.has(msg.author.id)) effects.set(msg.author.id, temp);
        effects.get(msg.author.id).set(item.id, eff);
      } else {
        const useref = effects.get(msg.author.id) ;
        if (!useref || useref.has(item.id)) {
          const meh = new Collection<string, Effects>();
          meh.set(item.id, new Effects());
          effects.set(msg.author.id, meh)
        }
      }
    }
  }

  // this too fricking time istg 
  roll(emojis: string[], oddRdce: number) {
    const { randomInArray, randomNumber } = this.client.util;
    const emoji = randomInArray(emojis);
    const odds = randomNumber(1, 150);

    function filter<A>(x: A[], comp: A): boolean {
      return !x.some((y: A) => y === comp);
    }

    function deepFilter<A>(srcArr: A[], filtArr: A[]): A[] {
      return srcArr.filter((src: A) => filter(filtArr, src));
    }

    if (odds > (145 - oddRdce)) {
      return Array(3).fill(emoji);
    } else if (odds > 100) {
      const emjis = Array(3).fill(emoji);
      const ind = randomNumber(1, emjis.length) - 1;
      emjis[ind] = randomInArray(emojis.filter(e => e !== emoji));
      return emjis;
    }

    let secondSlot: string;
    return [emoji, ...Array(2).fill(emoji).map((_, i) => {
      if (i === 0) return secondSlot = randomInArray(deepFilter(emojis, [emoji]));
      return randomInArray(deepFilter(emojis, [emoji, secondSlot]));
    })];
  }

  /**
   * Basically the whole thang
   * @param _ a discord message object
   * @param args the passed arguments
   */
  async exec(
    _: Message,
    args: {
      amount?: number;
    }
  ): Promise<string | MessageOptions> {
    const {
      util,
      util: { effects },
      config: { currency },
      db: { currency: DB },
    } = this.client;

    // Check Args
    const { amount: bet } = args;
    if (!bet) return;

    // Item Effects
    const data = await DB.fetch(_.author.id);
    let slots: number = 0;
    for (const it of ['crazy', 'brian']) {
      const userEf = effects.get(_.author.id);
      if (!userEf) effects.set(_.author.id, new Collection<string, Effects>().set(it, new Effects()));
      if (effects.get(_.author.id).has(it)) {
        slots += effects.get(_.author.id).get(it).slots
      }
    }

    // Slot Emojis
    const emojis = Object.keys(this.slotMachine);
    const order = this.roll(emojis, slots);
    const outcome = `**>** :${[...order].join(':    :')}: **<**`;
    let { length, winnings, multiplier = 0 } = this.calcWinnings(bet, order);

    // Shit
    let description: string[] = [];
    let color: ColorResolvable = 'RED';
    let state: string = 'losing';
    let db: Document & CurrencyProfile;

    description.push(outcome);
    if (length === 1 || length === 2) {
      const jackpot = length === 1;
      data.pocket += winnings;
      db = await data.save();
      color = jackpot ? 'GOLD' : 'GREEN';
      state = jackpot ? 'jackpot' : 'winning';
      description.push(`\nYou won **${winnings.toLocaleString()}**`);
      description.push(`**Multiplier** \`x${multiplier}\``);
    } else {
      data.pocket -= bet;
      db = await data.save();
      color = 'RED';
      state = 'losing';
      description.push(`\nYou lost **${bet.toLocaleString()}**`);
    }

    // Final Message
    description.push(`You now have **${db.pocket.toLocaleString()}**`);
    const title = `${_.author.username}'s ${state} slot machine`;
    const embed = new Embed()
      .setAuthor(title, _.author.avatarURL({ dynamic: true }))
      .setDescription(description.join('\n'))
      .setColor(color);

    return { embed };
  }

  calcWinnings(bet: number, slots: string[]): { [k: string]: number } {
    const { slotMachine } = this;
    const rate: number[][] = Object.values(slotMachine);
    const emojis: string[] = Object.keys(slotMachine);

    // ty daunt
    const length = slots.filter((thing, i, ar) => ar.indexOf(thing) === i).length;
    const won: number[][] = rate.map((_, i, ar) => ar[emojis.indexOf(slots[i])]).filter(Boolean); // mapped to their index
    const [multi] = won.filter((ew, i, a) => a.indexOf(ew) !== i);

    if (length === 1 || length === 2) {
      let index = length === 1 ? 1 : 0; // [prop: string]: [number, number]
      let multiplier = multi[index]; // [number, number][0]
      let winnings = Math.round(bet * multiplier);
      return { length, winnings , multiplier };
    }

    return { length, winnings: 0 };
  }
}
