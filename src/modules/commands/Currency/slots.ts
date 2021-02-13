import { Argument, Command } from 'discord-akairo'
import { ColorResolvable } from 'discord.js';
import { EmojiResolvable } from 'discord.js';
import { Message } from 'discord.js'

export default class Currency extends Command {
  public client: Akairo.Client;
  public constructor() {
    super('slots', {
      aliases: ['slots', 'slotmachine', 's'],
      channel: 'guild',
      description: 'Spend some amount of coins on a slot machine',
      category: 'Currency',
      cooldown: 1000,
      args: [{ 
        id: 'amount', 
        type: Argument.union('number', 'string')
      }]
    });
  }

  /**
   * Checks command arguments and caps
   * @param _ a discord message obj
   * @param args the passed arguments
   */
  public async checkArgs(_: Message, args: any): Promise<any> {
    const { minBet, maxBet, maxPocket } = this.client.config.currency.gambleCaps;
    const db = await this.client.db.currency.fetch(_.author.id);
    let bet = args.amount;
    // no bet amounts 
    if (!bet) return [,,'You need something to gamble.'];
    // transform arguments
    if (isNaN(bet)) {
      if (bet === 'all') {
        bet = db.pocket;
      } else if (bet === 'half') {
        bet = Math.round(db.pocket / 2);
      } else if (bet === 'max') {
        bet = db.pocket > maxBet ? maxBet : db.pocket;
      } else if (bet === 'min') {
        bet = minBet;
      } else {
        return [false,,'You actually need a number to slot breh'];
      }
    }
    // check limits
    if (db.pocket <= 0) {
      return [false ,,'You have no coins lol'];
    }
    if (bet > maxBet) {
      return [false ,,`You cannot gamble higher than **${maxBet.toLocaleString()}** coins bruh.`];
    }
    if (bet < minBet) {
      return [false ,,`You cannot gamble lower than **${minBet.toLocaleString()}** coins bruh.`];
    }
    if (bet > db.pocket) {
      return [false ,,`You only have **${db.pocket.toLocaleString()}** coins lol don't try me.`];
    }
    if (db.pocket > maxPocket) {
      return [false ,,'You are too rich to use the slot machine lmfaooo'];
    }
    if (bet < 1) {
      return [false ,,'It\'s gotta be a real number yeah?'];
    }
    // else return something
    return [true, bet, null];
  }

  /**
   * Basically the whole thang
   * @param _ a discord message object
   * @param args the passed command arguments
   */
  public async exec(_: Message, args: any): Promise<Message> {
    const { util, db: { currency: DB }, config: { currency } } = this.client;
    // Check Args
    const [condition, bet, message] = await this.checkArgs(_, args);
    if (!condition) return _.channel.send(message);
    // Slot Emojis
    const [ a, b, c ] = Array(3).fill(null).map(() => util.randomInArray(Object.keys(currency.slotMachine)));
    const outcome = `**>** :${[a, b, c].join(':    :')}: **<**`;
    const msg = await _.channel.send({ embed: {
      author: { name: `${_.author.username}'s slot machine` },
      description: outcome
    }});

    // Calc amount
    const { total: multi } = await DB.util.calcMulti(this.client, _);
    let { length, winnings } = this.calcWinnings(bet, [a, b, c], multi);
    // Visuals
    let color: ColorResolvable = 'RED';
    let description: string, db: any;
    let state: 'losing' | 'winning' | 'jackpot' = 'losing';

    if (length === 1 || length === 2) {
      const { maxWin } = currency.gambleCaps;
      if (winnings > maxWin) winnings = maxWin;
      let percentWon: number = Math.round((winnings / bet) * 100);
      db = await DB.addPocket(_.author.id, winnings);
      if (length === 1) {
        color = 'GOLD'; state = 'jackpot';
        description = [
          `**JACKPOT! You won __${percentWon}%__ of your bet.**`,
          `You won **${winnings.toLocaleString()}** coins.`
        ].join('\n');
      } else {
        color = 'GREEN'; state = 'winning';
        description = [
          `**Winner! You won __${percentWon}%__ of your bet.**`,
          `You won **${winnings.toLocaleString()}** coins.`
        ].join('\n');
      }
    } else {
      db = await DB.removePocket(_.author.id, bet);
      color = 'RED'; state = 'losing';
      description = [
        `**RIP! You lost this round.**`,
        `You lost **${bet.toLocaleString()}** coins.`
      ].join('\n');
    }

    // Final Message
    description += `\n\nYou now have **${db.pocket.toLocaleString()}** coins.`
    await this.client.util.sleep(1000);
    return msg.edit({ embed: {
      author: { 
        name: `${_.author.username}'s ${state} slot machine`,
        iconURL: _.author.avatarURL({ dynamic: true }) },
      color, description, fields: [{ 
        name: 'Outcome', 
        value: outcome, 
        inline: true 
      }],
      footer: { 
        text: `Multiplier: ${multi}%`,
        iconURL: this.client.user.avatarURL() }
    }});
  }

  private calcWinnings(bet: number, slots: string[], multi: number): { [k: string]: number } {
    const { slotMachine } = this.client.config.currency;
    const rate: number[] = Object.values(slotMachine);
    const emojis: string[] = Object.keys(slotMachine);
    // ty daunt
    const filter = (thing: string, i: number, ar: string[]) => ar.indexOf(thing) === i;
    const length = slots.filter(filter).length;
    const won: number[] = rate.map((_, i, ar) => ar[emojis.indexOf(slots[i])]).filter(Boolean); // mapped to their index
    const [emojWins] = won.filter((ew: number, i: number, a: number[]) => a.indexOf(ew) !== i);

    if (length === 1 || length === 2) {
      let winnings: any = Array(length === 1 ? 3 : length).fill(emojWins) // emoji's base winnings as items
      winnings = winnings.map((e: number) => bet * e).reduce((p: number, c: number) => {
        return Math.round((p + c) / (multi / 100))
      });

      return { length, winnings: Math.round(winnings) };
    } else {
      return { length, winnings: 0 };
    }
  }
}