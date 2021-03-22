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

  /**
   * Basically the whole thang
   * @param _ a discord message object
   * @param args the passed command arguments
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
    const data = await DB.updateItems(_.author.id);
    let slots: number = 0;
    for (const it of ['crazy', 'brian']) {
      const userEf = effects.get(_.author.id);
      if (!userEf) effects.set(_.author.id, new Collection<string, Effects>().set(it, new Effects()));
      if (userEf.has(it)) {
        slots += userEf.get(it).slots
      }
    }

    // Slot Emojis 78
    const emojis = Object.keys(this.slotMachine);
    const jEmoji = util.randomInArray(emojis);
    const jOdds = Math.random() > (0.95 - slots);
    const wOdds = Math.random() > 0.7;
    let order: string[] = Array(3);
    if (jOdds) {
      order = order.fill(jEmoji);
    } else if (wOdds) {
      let index = util.randomNumber(0, emojis.length - 1);
      order = Array(3).fill(jEmoji);
      order[index] = util.randomInArray(emojis.filter(s => s !== jEmoji));
    } else {
      let a = util.randomInArray(emojis);
      let b = util.randomInArray(emojis.filter(e => ![a].some(aa => aa === e)))
      let c = util.randomInArray(emojis.filter(e => ![a, b].some(aa => aa === e)));
      order = order.fill(null);
      [a, b, c].forEach((slot, i, a) => order[i] = slot);
    }

    const outcome = `**>** :${[...order].join(':    :')}: **<**`;
    let { length, winnings, multiplier = 0 } = this.calcWinnings(bet, order);

    // Visuals
    let description: string[] = [];
    let color: ColorResolvable = 'RED';
    let state: string = 'losing';
    let db: Document & CurrencyProfile;

    description.push(outcome);
    if (length === 1 || length === 2) {
      data.pocket += winnings;
      db = await data.save();
      const jackpot = length === 1;
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

  private calcWinnings(bet: number, slots: string[]): { [k: string]: number } {
    const { slotMachine } = this;
    const rate: number[][] = Object.values(slotMachine);
    const emojis: string[] = Object.keys(slotMachine);
    // ty daunt
    const length = slots.filter(
      (thing: string, i: number, ar: string[]) => ar.indexOf(thing) === i
    ).length;
    const won: number[][] = rate
      .map((_, i, ar) => ar[emojis.indexOf(slots[i])])
      .filter(Boolean); // mapped to their index
    const [multi] = won.filter(
      (ew: number[], i: number, a: number[][]) => a.indexOf(ew) !== i
    );

    if (length === 1 || length === 2) {
      let index: number; // prop of [number, number];
      let m: number; // the emoji multi
      index = length === 1 ? 1 : 0;
      m = multi[index];

      return {
        length,
        winnings: Math.round(bet * m),
        multiplier: m,
      };
    } else {
      return {
        length,
        winnings: 0,
      };
    }
  }
}
