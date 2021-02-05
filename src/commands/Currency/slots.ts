import { Argument, Client, Command } from 'discord-akairo'
import { ColorResolvable } from 'discord.js';
import { EmojiResolvable } from 'discord.js';
import { Message } from 'discord.js'

export default class Currency extends Command {
  public client: Client;
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
   * Picks random objects from the array 3 times for the main slot machine
   * @param emojis an array of slot emoji objects
   */
  public roll(emojis: EmojiResolvable[]): EmojiResolvable[] {
    const { util } = this.client;
    const slots = [];
    for (let i = 0; i < 3; i++) {
      slots.push(util.randomInArray(emojis));
    }
    return slots;
  }

  /**
   * Checks command arguments and caps
   * @param _ a discord message obj
   * @param args the passed arguments
   */
  public async checkArgs(_: Message, args: any): Promise<any> {
    const { minBet, maxBet, maxPocket } = this.client.config.currency.caps;
    const db = await this.client.db.currency.fetch(_.author.id);
    let bet = args.amount;
    // no bet amounts 
    if (!bet) [,,'You need something to gamble.'];
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
    const { db: DB, config: { currency } } = this.client;
    // Check Args
    const [condition, bet, message] = await this.checkArgs(_, args);
    if (!condition) return _.channel.send(message);
    // Slot Emojis
    const [ a, b, c ] = this.roll(currency.slots.emojis);
    const outcome = `**>** :${[a, b, c].join(':    :')}: **<**`;
    const msg = await _.channel.send({ embed: {
      author: { name: `${_.author.username}'s slot machine` },
      description: outcome
    }});

    // Calc amount
    const multi = await DB.currency.util.calcMulti(this.client, _);
    const data = await DB.currency.fetch(_.author.id);
    let { isWin, winnings } = this.calcWinnings([a, b, c], data, bet);
    // Visuals
    let color: ColorResolvable = 'RED';
    let description: string, db: any;
    let state: 'losing' | 'winning' | 'jackpot' = 'losing';

    if (isWin) {
      const { maxWin } = currency.caps;
      if (winnings > maxWin) winnings = maxWin;
      let percentWon: number = Math.round((winnings / bet) * 100);
      db = await DB.currency.addPocket(_.author.id, winnings);
      color = 'GOLD'; state = 'jackpot';
      description = [
        `**JACKPOT! You won __${percentWon}%__ of your bet.**`,
        `You won **${winnings.toLocaleString()}** coins.`
      ].join('\n');
    } else {
      db = await DB.currency.removePocket(_.author.id, bet);
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
  
  /**
   * Calculates the overall winnings for the slot machine
   * @param {EmojiResolvable} order  an array of emojis
   * @param {object} data the mongodb data of te author
   * @param {number} bet the bet amount of the author
   * @returns {object} 
   */
  public calcWinnings(
    order: EmojiResolvable[], 
    data: any, bet: number
    ): { isWin: boolean, winnings: number } {

    const { emojis, winnings } = this.client.config.currency.slots;
    const slots: EmojiResolvable[] = [...order];

    if (slots.every((
      emoji: EmojiResolvable,
      i: number,
      arr: EmojiResolvable[]) => {
      return emoji === arr[0];
    })) {
      let won: number | number[] = slots.map(s => winnings[emojis.indexOf(s)]);
      won = won.reduce((p, c) => p + c);
      let multi = (won + (won * (data.multi / 100)));
      won = Math.round(multi * bet);

      return { isWin: true, winnings: won };
    }
    
    return { isWin: false, winnings: 0 };
  }
}