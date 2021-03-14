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
      middle_finger: 1,
      clown: 1,
      eyes: 1,
      eggplant: 1,
      peach: 2,
      alien: 2,
      star2: 2,
      flushed: 3,
      fire: 5
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
    const [a, b, c] = Array(3)
      .fill(null)
      .map(() => util.randomInArray(Object.keys(this.slotMachine)));
    const outcome = `**>** :${[a, b, c].join(':    :')}: **<**`;
    // Calc amount
    const { maxWin, maxMulti } = currency;
    let { length, winnings, map = 0 } = this.calcWinnings(bet, [a, b, c]);

    // Visuals
    let color: ColorResolvable = 'RED';
    let description: string[] = [];
    let db: Document & CurrencyProfile;
    let state: string = 'losing';

    description.push(outcome);
    if (length === 1 || length === 2) {
      if (winnings > maxWin) winnings = maxWin as number;
      let percentWon: number = Math.round((winnings / bet) * 100);
      db = await DB.add(_.author.id, 'pocket', winnings);
      const jackpot = length === 1;
      color = jackpot ? 'GOLD' : 'GREEN';
      state = jackpot ? 'jackpot' : 'winning';
      description.push(`\nYou won **${winnings.toLocaleString()}**.`);
      description.push(`**Multiplier** \`x${map}\`.`);
    } else {
      db = await DB.remove(_.author.id, 'pocket', bet);
      color = 'RED';
      state = 'losing';
      description.push(`\nYou lost **${bet.toLocaleString()}**.`)
    }

    // Final Message
    description.push(`You now have **${db.pocket.toLocaleString()}**.`);
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
    const rate: number[] = Object.values(slotMachine);
    const emojis: string[] = Object.keys(slotMachine);
    // ty daunt
    const length = slots.filter(
      (thing: string, i: number, ar: string[]) => ar.indexOf(thing) === i
    ).length;
    const won: number[] = rate
      .map((_, i, ar) => ar[emojis.indexOf(slots[i])])
      .filter(Boolean); // mapped to their index
    const [emojRate] = won.filter(
      (ew: number, i: number, a: number[]) => a.indexOf(ew) !== i
    );

    if (length === 1 || length === 2) {
      let winnings: any = Array(length === 1 ? 3 : length).fill(emojRate); // emoji's base winnings as items
      let map = [...winnings].reduce((p, c) => p + c);
      winnings = winnings
        .map((w: number) => w * bet)
        .reduce((p: number, c: number) => p + c);

      return { 
        map,
        length, 
        winnings: Math.round(winnings) 
      };
    } else {
      return { 
        length, 
        winnings: 0 
      };
    }
  }
}
