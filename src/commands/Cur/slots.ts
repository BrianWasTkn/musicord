import { Message, MessageEmbed } from 'discord.js'
import { LavaClient, Command } from 'discord-akairo'

export default class Currency extends Command {
  public client: LavaClient;
  public constructor() {
    super('slots', {
      aliases: ['slots', 'slotmachine', 's'],
      channel: 'guild',
      cooldown: 3000,
      args: [{ 
        id: 'amount', match: 'content'
      }]
    });
  }

  private _roll(emojis: any): Array<{ emoji: string, winnings: number }> {
    const slots = [];
    for (let i = 0; i < 3; ++i) {
      slots.push(emojis[i]);
    }
    return slots;
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { minBet, maxBet, maxWin, maxPocket } = this.client.config.gamble;
    const { channel, member: { user } } = _;
    const data = await this.client.db.currency
      .fetch(user.id);
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
      } else if (bet === 'max') {
        bet = pocket > maxBet ? maxBet : pocket;
      } else {
        return _.reply('You need a real number');
      }
    }

    // Other Arg checking
    bet = Number(bet);
    if (pocket <= 0) {
      return _.reply('You have no coins lol');
    }
    if (bet > maxBet) {
      return _.reply(`You cannot gamble higher than **${maxBet.toLocaleString()}** coins bruh.`)
    }
    if (bet < minBet) {
      return _.reply(`You cannot gamble lower than **${minBet.toLocaleString()}** coins bruh.`)
    }
    if (bet > pocket) {
      return _.reply(`You only have **${pocket.toLocaleString()}** coins lol don't try me.`);
    }
    if (pocket > maxPocket) {
      return _.reply('You are too rich to use the slot machine lmfaooo');
    }
    if (bet < 1) {
      return _.reply('It\'s gotta be a real number yeah?')
    }

    // Slot Emojis
    const { slots: emojis } = this.client.config.gamble;
    const slots = this._roll(emojis);
    const [a, b, c] = slots;
    const outcome = `\> :${a.emoji}:   :${b.emoji}:   :${c.emoji}: <`;

    // Cases
    let winnings: number, color: string;
    if (
      a.emoji === b.emoji && 
      c.emoji === b.emoji && 
      a.emoji === c.emoji
    ) {
      // Jackpot
      winnings = (b.winnings * 2) + (multi / 100);
      winnings = Math.round(winnings * bet);
      color = 'GOLD';
    } else if (a.emoji === b.emoji && a.emoji !== c.emoji) {
      // Left == Middle
      winnings = a.winnings + (multi / 100);
      winnings = Math.round(winnings * bet);
      color = 'GREEN';
    } else if (a.emoji === c.emoji && a.emoji !== b.emoji) {
      // Left == Right
      winnings = b.winnings + (multi / 100);
      winnings = Math.round(winnings * bet);
      color = 'GREEN';
    } else if (b.emoji === c.emoji && b.emoji !== a.emoji) {
      // Middle == Right
      winnings = c.winnings + (multi / 100);
      winnings = Math.round(winnings * bet);
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
      const db = await this.client.db.currency.addPocket(_.author.id, winnings);
      state = 'winning';
      percentWon = Math.round((winnings / bet) * 100);
      description = [
        `**Winner! You won __${percentWon}%__ of your bet.**`,
        `You won **${winnings.toLocaleString()}** coins.\n`,
        `You now have **${db.pocket.toLocaleString()}** coins.`
      ];
    } else if (color === 'GOLD') {
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
    return channel.send({ embed: {
      author: { 
        name: `${user.username}'s ${state} gambling game`,
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