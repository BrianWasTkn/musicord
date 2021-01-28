import { Argument, Client, Command } from 'discord-akairo'
import { ColorResolvable } from 'discord.js';
import { EmojiResolvable } from 'discord.js';
import { Message } from 'discord.js'

type SlotEmoji = [EmojiResolvable, number];

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
  public roll(emojis: SlotEmoji[]): SlotEmoji[] {
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
    // Check Args
    const [condition, bet, message] = await this.checkArgs(_, args);
    if (!condition) return _.channel.send(message);
    // Slot Emojis
    const [ a, b, c ] = this.roll(this.client.config.currency.emojis);
    const outcome = `**>** :${a[0]}:    :${b[0]}:    :${c[0]}: **<**`;
    const msg = await _.channel.send({ embed: {
      author: { name: `${_.author.username}'s slot machine` },
      description: outcome
    }});
    // Calc amount
    const multi = await this.client.db.currency.util.calcMulti(this.client, _);
    const data = await this.client.db.currency.fetch(_.author.id);
    let { isWin, winnings, jackpot } = this.calcWinnings({ a, b, c }, data, bet);
    // Visuals
    let color: ColorResolvable = 'RED';
    let description: string, db: any;
    let state: 'losing' | 'winning' | 'jackpot' = 'losing';
    // Win or Not
    if (!isWin) {
      color = 'RED';
      description = `**RIP! You lost this round.**\nYou lost **${bet.toLocaleString()}** coins.`;
      db = await this.client.db.currency.removePocket(_.author.id, bet);
    } else {
      const { maxWin } = this.client.config.currency.caps;
      if (winnings > maxWin) winnings = maxWin;
      let percentWon: number = Math.round((winnings / bet) * 100);
      db = await this.client.db.currency.addPocket(_.author.id, winnings);
      if (jackpot) {
        color = 'GOLD'; state = 'jackpot';
        description = `**JACKPOT! You won __${percentWon}%__ of your bet.**`;
      } else {
        color = 'GREEN'; state = 'winning';
        description = `**GG! You won __${percentWon}%__ of your bet.**`;
      }
      description += `\nYou won **${winnings.toLocaleString()}** coins.`
    }

    // Final Message
    await this.client.util.sleep(1000);
    return msg.edit({ embed: {
      author: { 
        name: `${_.author.username}'s ${state} slot machine`,
        iconURL: _.author.avatarURL({ dynamic: true }) },
      color, description: `${description}\n\nYou now have **${db.pocket.toLocaleString()}** coins.`,
      fields: [{ 
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
   * @param slots an object of random slotted emojis
   * @param multi the multiplier of the author
   * @param bet the bet amount of the author
   */
  public calcWinnings({ a, b, c }: any, multi: number, bet: number): { isWin: boolean, winnings: number, jackpot: boolean } {

    let { emojis } = this.client.config.currency;
    let { util } = this.client;
    let winnings = 0;
    let jackpot = false;
    let emoji: SlotEmoji = util.randomInArray(emojis);

    let slots = []; let machine = [a, b, c];
    machine.forEach((s: SlotEmoji, i: number) => {
      if (s[0] === emoji[0]) {
        slots.push(s);
      }
    })

    console.log(slots);
    // let f = [['a'], ['b'], ['c'], ['d'], ['e']];
    // let m = []; let c = this.client.util.randomInArray(f);
    // for (let d = 0; d < 3; ++d) {
    // m.push(this.client.util.randomInArray(f));
    // }
    // await _.delete();
    // return m.filter((e, i)=> e[0][0] === c[0]).map(k => [...k]);

    if (slots.length <= 1) {
      return { isWin: false, winnings, jackpot };
    } else if (slots.length >= 2) {
      slots.forEach((s: SlotEmoji) => {
        let f = (s[1] * bet);
        winnings += f + (f * (multi / 100));
      });

      winnings = Math.round(winnings);
      jackpot = false;
      if (slots.length === 3) jackpot = true;
      return { isWin: true, winnings, jackpot };
    }
  }
}