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

  async before(msg: Message) {
    const { effects } = this.client.util;
    const data = await this.client.db.currency.updateItems(msg.author.id);
    const eff = new Effects();

    const crazy = data.items.find(i => i.id === 'crazy');
    const heart = data.items.find(i => i.id === 'brian');
    const e = {
      'crazy': 0.1,
      'brian': 0.1
    }

    for (const item of [crazy, heart]) {
      if (item.expire > Date.now()) {
        const appliedEff = eff.setWinnings(e[item.id]);
        const userEf = effects.get(msg.author.id) || effects.set(msg.author.id, new Collection<string, Effects>().set(item.id, appliedEff));
        effects.get(msg.author.id).set(item.id, appliedEff)
      } else {
        const useref = effects.get(msg.author.id) ;
        if (!useref || useref.has(item.id)) {
          const meh = new Collection<string, Effects>();
          meh.set(item.id, new Effects());
          return effects.set(msg.author.id, meh)
        }

        continue;
      }
    }
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
    const userEf = effects.get(_.author.id);
    for (const it of ['crazy', 'brian']) {
      if (userEf.get(it)) {
        slots += userEf.get(it).slots
      }
    }

    // Slot Emojis
    const emojis = Object.keys(this.slotMachine);
    const jOdds = Math.random() > (0.95 - slots);
    const jEmoji = util.randomInArray(emojis);
    const [a, b, c] = Array(3).fill(null).map((_, i) => (jOdds ? jEmoji : util.randomInArray(emojis)));
    const order = [a, b, c];
    const outcome = `**>** :${[...order].join(':    :')}: **<**`;
    let { length, winnings, multiplier = 0 } = this.calcWinnings(bet, order);

    // Visuals
    let color: ColorResolvable = 'RED';
    let description: string[] = [];
    let state: string = 'losing';

    description.push(outcome);
    if (length === 1 || length === 2) {
      data.pocket += winnings;
      const jackpot = length === 1;
      color = jackpot ? 'GOLD' : 'GREEN';
      state = jackpot ? 'jackpot' : 'winning';
      description.push(`\nYou won **${winnings.toLocaleString()}**`);
      description.push(`**Multiplier** \`x${multiplier}\``);
    } else {
      data.pocket -= bet;
      color = 'RED';
      state = 'losing';
      description.push(`\nYou lost **${bet.toLocaleString()}**`);
    }

    // Final Message
    await data.save();
    description.push(`You now have **${data.pocket.toLocaleString()}**`);
    await this.client.util.sleep(1000);
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
      let index: number; // index of [number, number];
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
