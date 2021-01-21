import { Message, MessageEmbed, Util } from 'discord.js'
import Lava from 'discord-akairo'

export default class Currency extends Lava.Command {
  public client: Lava.Client;
  public constructor() {
    super('slots', {
      aliases: ['slots', 'slotmachine', 's'],
      channel: 'guild',
      description: 'Spend some amount of coins on a slot machine',
      category: 'Currency',
      cooldown: 1000,
      args: [{ 
        id: 'amount', 
        type: Lava.Argument.union('number', 'string')
      }]
    });
  }

  private _roll(emojis: any): Array<{ emoji: string, winnings: number }> {
    const slots = [];
    for (let i = 0; i < 3; ++i) {
      slots.push(this.client.util.random('arr', emojis));
    }
    return slots;
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { caps } = this.client.config.currency;
    const { channel, member: { user } } = _;
    const data = await this.client.db.currency.fetch(user.id);
    const { pocket, vault, space, multi } = data;
    let bet = args.amount;

    if (!bet) {
      return _.reply('You need something to gamble.');
    }

    // Arg Checks
    if (isNaN(bet)) {
      if (bet === 'all') {
        bet = pocket;
      } else if (bet === 'half') {
        bet = Math.round(pocket / 2);
      } else if (bet === 'min') {
        bet = caps.minBet;
      } else if (bet === 'max') {
        bet = pocket > caps.maxBet ? caps.maxBet : pocket;
      } else {
        return channel.send('You need a real number');
      }
    }

    // Other Arg checking
    bet = Number(bet);
    if (pocket <= 0) {
      return channel.send('You have no coins lol');
    }
    if (bet > caps.maxBet) {
      return channel.send(`You cannot gamble higher than **${caps.maxBet.toLocaleString()}** coins bruh.`)
    }
    if (bet < caps.minBet) {
      return channel.send(`You cannot gamble lower than **${caps.minBet.toLocaleString()}** coins bruh.`)
    }
    if (bet > pocket) {
      return channel.send(`You only have **${pocket.toLocaleString()}** coins lol don't try me.`);
    }
    if (pocket > caps.maxPocket) {
      return channel.send('You are too rich to use the slot machine lmfaooo');
    }
    if (bet < 1) {
      return channel.send('It\'s gotta be a real number yeah?')
    }

    // Slot Emojis
    const { emojis } = this.client.config.currency;
    const slots = this._roll(emojis);
    const [a, b, c] = slots;
    const outcome = `**>** :${a.emoji}:    :${b.emoji}:    :${c.emoji}: **<**`;
    const msg = await channel.send({ embed: {
      author: { name: `${user.username}'s slot machine` },
      description: outcome
    }})

    // Cases
    let winnings: number, color: string;
    if (
      // Jackpot
      a.emoji === b.emoji && 
      a.emoji === c.emoji && 
      b.emoji === c.emoji
    ) {
      winnings = Math.round(bet + (bet * b.winnings) * 3 * (multi / 100));
      winnings = Math.round(winnings * bet);
      color = 'GOLD';
    } else if (
      // Left == Middle
      a.emoji === b.emoji && 
      a.emoji !== c.emoji && 
      b.emoji !== c.emoji
    ) {
      winnings = Math.round(bet + (bet * a.winnings) * 2 * (multi / 100));
      color = 'GREEN';
    } else if (
      // Left == Right
      a.emoji !== b.emoji && 
      a.emoji === c.emoji && 
      b.emoji !== c.emoji
    ) {
      // Left == Right
      winnings = Math.round(bet + (bet * c.winnings) * 2 * (multi / 100));
      color = 'GREEN';
    } else if (
      // Middle == Right
      a.emoji !== b.emoji && 
      a.emoji !== c.emoji && 
      b.emoji == c.emoji
    ) {
      winnings = Math.round(bet + (bet * b.winnings) * 2 * (multi / 100));
      color = 'GREEN';
    } else {
      // Lose
      color = 'RED';
    }

    // Visuals and DB
    let description: string[], state: string, percentWon: number;
    if (color === 'RED') {
      const db = await this.client.db.currency.removePocket(_.author.id, bet);
      state = 'losing';
      description = [
        `**RIP! You lost this round.**`,
        `You lost **${bet.toLocaleString()}** coins.\n`,
        `You now have **${db.pocket.toLocaleString()}** coins.`
      ];
    } else if (color === 'GREEN') {
      if (winnings >= caps.maxWin) winnings = caps.maxWin;
      const db = await this.client.db.currency.addPocket(_.author.id, winnings);
      state = 'winning';
      percentWon = Math.round((winnings / bet) * 100);
      description = [
        `**Winner! You won __${percentWon}%__ of your bet.**`,
        `You won **${winnings.toLocaleString()}** coins.\n`,
        `You now have **${db.pocket.toLocaleString()}** coins.`
      ];
    } else if (color === 'GOLD') {
      if (winnings >= caps.maxWin) winnings = caps.maxWin;
      const db = await this.client.db.currency.addPocket(_.author.id, winnings);
      state = 'jackpot';
      percentWon = Math.round((winnings / bet) * 100);
      description = [
        `**JACKPOT! You won __${percentWon}%__ of your bet.**`,
        `You won **${winnings.toLocaleString()}** coins.\n`,
        `You now have **${db.pocket.toLocaleString()}** coins.`
      ];
    }

    // Message
    await this.client.util.sleep(1000);
    return msg.edit({ embed: {
      author: { 
        name: `${user.username}'s ${state} slot machine`,
        iconURL: user.avatarURL({ dynamic: true }) },
      color, description: description.join('\n'),
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
}