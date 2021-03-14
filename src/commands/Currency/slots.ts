import { ColorResolvable, Message, MessageOptions } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { Argument } from 'discord-akairo';
import { Document } from 'mongoose';
import { Command } from '@lib/handlers/command';
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
      middle_finger: [1, 2],
      clown: [2, 3],
      eyes: [2, 5],
      eggplant: [3, 8],
      peach: [5, 10],
      alien: [8, 25],
      star2: [10, 50],
      flushed: [25, 75],
      fire: [50, 250]
    };
  }

  /**
   * Basically the whole thang
   * @param _ a discord message object
   * @param args the passed command arguments
   */
  async exec(_: Message, args: {
    amount?: number
  }): Promise<string | MessageOptions> {
    const {
      util,
      db: { currency: DB },
      config: { currency },
    } = this.client;

    // Check Args
    const { amount: bet } = args;
    if (!bet) return;
    
    // Slot Emojis
    const emojis = Object.keys(this.slotMachine);
    const jOdds = Math.random() > 0.95;
    const jEmoji = util.randomInArray(emojis);
    const [a, b, c] = Array(3).fill(null)
      .map(() => jOdds ? jEmoji : util.randomInArray(emojis))

    const outcome = `**>** :${[a, b, c].join(':    :')}: **<**`;
    // Calc amount
    const { maxMulti } = currency;
    let { length, winnings, multiplier = 0 } = this.calcWinnings(bet, [a, b, c]);

    // Visuals
    let color: ColorResolvable = 'RED';
    let description: string[] = [];
    let db: Document & CurrencyProfile;
    let state: string = 'losing';

    description.push(outcome);
    if (length === 1 || length === 2) {
      let percentWon: number = Math.round((winnings / bet) * 100);
      db = await DB.add(_.author.id, 'pocket', winnings);
      const jackpot = length === 1;
      color = jackpot ? 'GOLD' : 'GREEN';
      state = jackpot ? 'jackpot' : 'winning';
      description.push(`\nYou won **${winnings.toLocaleString()}**`);
      description.push(`**Multiplier** \`x${multiplier}\``);
    } else {
      db = await DB.remove(_.author.id, 'pocket', bet);
      color = 'RED';
      state = 'losing';
      description.push(`\nYou lost **${bet.toLocaleString()}**`)
    }

    // Final Message
    description.push(`You now have **${db.pocket.toLocaleString()}**`);
    await this.client.util.sleep(1000);
    const title = `${_.author.username}'s ${state} slot machine`;
    const embed = new Embed()
      .setAuthor(title, _.author.avatarURL({ dynamic: true }))
      .setDescription(description.join('\n'))
      .setColor(color);

    return { embed };
  }

  private calcWinnings(
    bet: number,
    slots: string[]
  ): { [k: string]: number } {
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
        winnings: 0 
      };
    }
  }
}
