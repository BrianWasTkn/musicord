import { ColorResolvable, MessageOptions, Collection } from 'discord.js';
import { Context } from '@lib/extensions/message';
import { Document } from 'mongoose';

import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { Command } from '@lib/handlers/command';
import { Effects } from '@lib/utility/effects';
import { Embed } from '@lib/utility/embed';

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
      broken_heart:      [1, 3, false],
      middle_finger:     [1, 5, false],
      clown:             [1, 10, false],
      pizza:             [1, 15, false],
      eggplant:          [1, 25, false],
      peach:             [1, 50, false],
      flushed:           [1, 75, true],
      star2:             [1, 100, true],
      fire:              [1, 1000, true],
      four_leaf_clover:  [1, 2500, true],
      kiss:              [1, 5000, true],
    };
  }

  // this took fricking time istg
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

    if (odds > 145 - oddRdce) {
      return Array(3).fill(emoji);
    } else if (odds > (95 - Math.floor(oddRdce / 2))) {
      const emjis = Array(3).fill(emoji);
      const ind = randomNumber(1, emjis.length) - 1;
      emjis[ind] = randomInArray(emojis.filter((e) => e !== emoji));
      return emjis;
    }

    let secondSlot: string;
    return [
      emoji,
      ...Array(2)
        .fill(emoji)
        .map((_, i) => {
          if (i === 0)
            return (secondSlot = randomInArray(deepFilter(emojis, [emoji])));
          return randomInArray(deepFilter(emojis, [emoji, secondSlot]));
        }),
    ];
  }

  /**
   * Basically the whole thang
   * @param _ a discord message object
   * @param args the passed arguments
   */
  async exec(ctx: Context<{ amount: number }>): Promise<string | MessageOptions> {
    const {
      util: { effects },
    } = this.client;

    // Check Args
    const { amount: bet } = ctx.args;
    if (!bet) return;

    // Item Effects
    const { data } = await ctx.db.fetch();
    let slots: number = 0;
    for (const it of ['crazy', 'brian']) {
      const userEf = effects.get(ctx.author.id);
      if (!userEf) {
        const col = new Collection<string, Effects>().set(it, new Effects());
        effects.set(ctx.author.id, col);
      }
      if (effects.get(ctx.author.id).has(it)) {
        slots += effects.get(ctx.author.id).get(it).slotJackpotOdds;
      }
    }

    // Slot Emojis
    const emojis = Object.keys(this.slotMachine);
    const order = this.roll(emojis, slots);
    const outcome = `**>** :${order.join(':    :')}: **<**`;
    let { length, winnings } = this.calcWinnings(bet, order);

    // Shit
    let description: string[] = [];
    let color: ColorResolvable = 'RED';
    let state: string = 'losing';

    description.push(outcome);
    if (length === 1 || length === 2) {
      const jackpot = length === 1;
      const d = await ctx.db
        .addPocket(winnings)
        .updateItems()
        .calcSpace()
        .save(); 

      color = jackpot ? (slots ? 'BLUE' : 'GOLD') : 'GREEN';
      state = jackpot ? (slots ? 'powered' : 'jackpot') : 'winning';
      description.push(`\nYou won **${winnings.toLocaleString()}**`);
      description.push(`**Multiplier** \`x${Math.round(winnings / bet).toLocaleString()}\``);
      description.push(`You now have **${d.pocket.toLocaleString()}**`);
    } else {
      const d = await ctx.db
        .removePocket(bet)
        .updateItems()
        .calcSpace()
        .save();

      color = 'RED';
      state = 'losing';
      description.push(`\nYou lost **${bet.toLocaleString()}**`);
      description.push(`You now have **${d.pocket.toLocaleString()}**`);
    }

    // Final Message
    const title = `${ctx.author.username}'s ${state} slot machine`;
    const embed = new Embed()
      .setAuthor(title, ctx.author.avatarURL({ dynamic: true }))
      .setDescription(description.join('\n'))
      .setColor(color);

    return { embed };
  }

  calcWinnings(bet: number, slots: string[]) {
    const { slotMachine } = this;
    const rate: (number | boolean)[][] = Object.values(slotMachine);
    const emojis: string[] = Object.keys(slotMachine);

    // ty daunt
    const length = slots.filter((thing, i, ar) => ar.indexOf(thing) === i)
      .length;
    const won: (number | boolean)[][] = rate
      .map((_, i, ar) => ar[emojis.indexOf(slots[i])])
      .filter(Boolean); // mapped to their index
    const [multi] = won.filter((ew, i, a) => a.indexOf(ew) !== i);

    // Win or Jackpot
    if (length === 1 || length === 2) {
      let index = length === 1 ? 1 : 0; // [prop: string]: [number, number]
      let multiplier = multi[index] as number; // [number, number][0]

      // Blacklisted Doubles
      if (!multi[2] && length === 2) {
        if (slots.some(s => s === emojis[emojis.length - 1])) {
          return { length: 2, winnings: bet };
        }
        
      	return { length: 3, winnings: 0 };
      }
      
      let winnings = Math.round(bet * multiplier);
      return { length, winnings };
    }

    // includes one op emoji
    if (slots.some(s => s === emojis[emojis.length - 1])) {
      return { length: 2, winnings: bet };
    }

    // Lost
    return { length, winnings: 0 };
  }
}
