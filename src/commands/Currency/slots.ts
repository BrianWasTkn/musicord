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
    const data = await this.client.db.currency.fetch(msg.author.id);
    const items = this.client.handlers.item.modules;
    const itemEf: { [k: string]: [keyof Effects, number, string] } = {
      'heart': ['setSlotOdds', 0.1, 'heart'],
      'crazy': ['setSlotOdds', 0.1, 'crazy']
    }

    for (const item of [...items.values()]) {
      for (const [it, val] of Object.entries(itemEf)) {
        const im = itemEf[it];
        await this.client.util.updateEffects(msg.author.id, im[0], im[1], im[2])
      }
    }
  }

  private get slotMachine() {
    return {
      middle_finger: [1, 2],
      clown: [1, 2],
      eyes: [1, 3],
      eggplant: [2, 3],
      peach: [2, 4],
      alien: [3, 5],
      star2: [8, 10],
      flushed: [10, 15],
      fire: [25, 500],
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
    if (!userEf.get('crazy')) slots += 0;
    else slots += userEf.get('crazy').slots;
    if (!userEf.get('heart')) slots += 0;
    else slots += userEf.get('heart').slots;

    // Slot Emojis
    const emojis = Object.keys(this.slotMachine);
    const jOdds = Math.random() > (0.98 - slots);
    const jEmoji = util.randomInArray(emojis);
    const [a, b, c] = Array(3).fill(null).map(() => (jOdds ? jEmoji : util.randomInArray(emojis)));
    const order = [a, b, c];
    const outcome = `**>** :${[...order].join(':    :')}: **<**`;
    let { length, winnings, multiplier = 0 } = this.calcWinnings(bet, order);

    // Visuals
    let color: ColorResolvable = 'RED';
    let description: string[] = [];
    let state: string = 'losing';

    description.push(outcome);
    if (length === 1 || length === 2) {
      let percentWon: number = Math.round((winnings / bet) * 100);
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
