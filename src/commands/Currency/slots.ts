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
      middle_finger: 0.403,
      clown: 0.409,
      eyes: 0.505,
      eggplant: 0.601,
      peach: 0.607,
      alien: 0.702,
      star2: 0.708,
      flushed: 0.804,
      fire: 0.901, // +0.001
    };
  }

  /**
   * Checks command arguments and caps
   * @param _ a discord message obj
   * @param args the passed arguments
   */
  private async checkArgs(
    _: Message,
    args: {
      amount: string | number;
    }
  ): Promise<string | number> {
    const { minBet, maxBet, maxPocket } = this.client.config.currency;
    const { pocket } = await this.client.db.currency.fetch(_.author.id);
    let bet = Number(args.amount);

    // check limits
    if (pocket <= 0) return 'You have no coins :skull:';
    if (bet > maxBet)
      return `You can't gamble higher than **${maxBet.toLocaleString()}** coins >:(`;
    if (bet < minBet)
      return `C'mon, you're not gambling lower than **${minBet.toLocaleString()}** yeah?`;
    if (bet > pocket)
      return `You only have **${pocket.toLocaleString()}** lol don't try me`;
    if (pocket > maxPocket) return `You're too rich to machine the slot`;
    if (bet < 1) return 'It should be a positive number yeah?';

    // else return something
    return bet;
  }

  /**
   * Basically the whole thang
   * @param _ a discord message object
   * @param args the passed command arguments
   */
  async exec(_: Message, args: any): Promise<string | MessageOptions> {
    const {
      util,
      db: { currency: DB },
      config: { currency },
    } = this.client;

    // Check Args
    const bet = await this.checkArgs(_, args);
    if (typeof bet === 'string') return bet;

    // Slot Emojis
    const [a, b, c] = Array(3)
      .fill(null)
      .map(() => util.randomInArray(Object.keys(this.slotMachine)));
    const outcome = `**>** :${[a, b, c].join(':    :')}: **<**`;
    // Calc amount
    const { maxWin, maxMulti } = currency;
    let { total: multi } = await DB.utils.calcMulti(this.client, _);
    if (multi >= maxMulti) multi = maxMulti as number;
    let { length, winnings } = this.calcWinnings(bet, [a, b, c], multi);

    // Visuals
    let color: ColorResolvable = 'RED';
    let description: string;
    let db: Document & CurrencyProfile;
    let state: string = 'losing';

    if (length === 1 || length === 2) {
      if (winnings > maxWin) winnings = maxWin as number;
      let percentWon: number = Math.round((winnings / bet) * 100);
      db = await DB.add(_.author.id, 'pocket', winnings);

      // Embed
      const jackpot = length === 1;
      color = jackpot ? 'GOLD' : 'GREEN';
      state = jackpot ? 'jackpot' : 'winning';
      description = jackpot
        ? [
            `**JACKPOT! You won __${percentWon}%__ of your bet.**`,
            `You won **${winnings.toLocaleString()}** coins.`,
          ].join('\n')
        : [
            `**Winner! You won __${percentWon}%__ of your bet.**`,
            `You won **${winnings.toLocaleString()}** coins.`,
          ].join('\n');
    } else {
      db = await DB.remove(_.author.id, 'pocket', bet);
      color = 'RED';
      state = 'losing';
      description = [
        `**RIP! You lost this round.**`,
        `You lost **${bet.toLocaleString()}** coins.`,
      ].join('\n');
    }

    // Final Message
    description += `\n\nYou now have **${db.pocket.toLocaleString()}** coins.`;
    await this.client.util.sleep(1000);
    const title = `${_.author.username}'s ${state} slot machine`;
    const embed = new Embed()
      .setFooter(false, `Multiplier: ${multi}%`, this.client.user.avatarURL())
      .setAuthor(title, _.author.avatarURL({ dynamic: true }))
      .addField('Outcome', outcome, true)
      .setDescription(description)
      .setColor(color);

    return { embed };
  }

  private calcWinnings(
    bet: number,
    slots: string[],
    multi: number
  ): { [k: string]: number } {
    const rate: number[] = Object.values(this.slotMachine);
    const emojis: string[] = Object.keys(this.slotMachine);
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
      winnings = winnings
        .map((w: number) => w * bet)
        .map((w: number) => w + w * (multi / 100))
        .reduce((p: number, c: number) => p + c);

      return { length, winnings: Math.round(winnings) };
    } else {
      return { length, winnings: 0 };
    }
  }
}
