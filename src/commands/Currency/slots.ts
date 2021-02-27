import { ColorResolvable, Message, MessageEmbed } from 'discord.js';
import { Argument, Command } from 'discord-akairo';
import { Document } from 'mongoose';
import { Lava } from '@lib/Lava'

export default class Currency extends Command {
  client: Lava;
  
  constructor() {
    super('slots', {
      aliases: ['slots', 'slotmachine', 's'],
      channel: 'guild',
      description: 'Spend some amount of coins on a slot machine',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'amount',
          type: Argument.union('number', 'string'),
        },
      ],
    });
  }

  private get slotMachine(): { [slot: string]: number } {
    return {
      middle_finger: 0.406,
      clown: 0.409,
      eyes: 0.505,
      eggplant: 0.509,
      peach: 0.603,
      alien: 0.608,
      star2: 0.703,
      flushed: 0.709,
      fire: 0.806,
    };
  }

  /**
   * Checks command arguments and caps
   * @param _ a discord message obj
   * @param args the passed arguments
   */
  private async checkArgs(_: Message, args: {
    amount: string | number
  }): Promise<string | number> {
    const { minBet, maxBet, maxPocket } = this.client.config.currency;
    const { pocket } = await this.client.db.currency.fetch(_.author.id);
    let bet = args.amount;

    // no bet amounts
    if (!bet) return 'You need something to gamble';

    // transform arguments
    if (isNaN(bet as number)) {
      bet = (<string>bet).toLowerCase()
      if (bet === 'all') {
        bet = pocket;
      } else if (bet === 'half') {
        bet = Math.round(pocket / 2);
      } else if (bet === 'max') {
        bet = pocket > maxBet ? maxBet : pocket;
      } else if (bet === 'min') {
        bet = minBet;
      } else {
        return 'You actually need a number to slot...';
      }
    }

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
  async exec(_: Message, args: any): Promise<Message> {
    const {
      util,
      db: { currency: DB },
      config: { currency },
    } = this.client;

    // Check Args
    const bet = await this.checkArgs(_, args);
    if (typeof bet === 'string') return _.channel.send(bet);

    // Slot Emojis
    const [a, b, c] = Array(3)
      .fill(null)
      .map(() => util.randomInArray(Object.keys(this.slotMachine)));
    const outcome = `**>** :${[a, b, c].join(':    :')}: **<**`;
    const msg = await _.channel.send({
      embed: new MessageEmbed()
        .setAuthor(`${_.author.username}'s slot machine`)
        .setDescription(outcome),
    });

    // Calc amount
    const { maxWin, maxMulti } = currency;
    let { total: multi } = await DB.util.calcMulti(this.client, _);
    if (multi >= maxMulti) multi = maxMulti as number;
    let { length, winnings } = this.calcWinnings(bet, [a, b, c], multi);

    // Visuals
    let color: ColorResolvable = 'RED';
    let description: string;
    let db: Document & Lava.CurrencyProfile;
    let state: string = 'losing';

    if (length === 1 || length === 2) {
      if (winnings > maxWin) winnings = maxWin as number;
      let percentWon: number = Math.round((winnings / bet) * 100);
      db = await DB.addPocket(_.author.id, winnings);

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
      db = await DB.removePocket(_.author.id, bet);
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
    return msg.edit({
      embed: new MessageEmbed()
        .setAuthor(
          `${_.author.username}'s ${state} slot machine`,
          _.author.avatarURL({ dynamic: true })
        )
        .setColor(color)
        .setDescription(description)
        .addField('Outcome', outcome, true)
        .setFooter(`Multiplier: ${multi}%`, this.client.user.avatarURL()),
    });
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
