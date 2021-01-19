import { Message, MessageEmbed } from 'discord.js'
import { LavaClient, Command } from 'discord-akairo'

export default class Currency extends Command {
  public client: LavaClient;
  public constructor() {
    super('bet', {
      aliases: ['gamble', 'roll', 'bet'],
      channel: 'guild',
      cooldown: 1000,
      args: [{ 
        id: 'amount', match: 'content'
      }]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { minBet, maxBet, maxWin, maxPocket } = this.client.config.gamble;
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
      return _.reply('You are too rich to gamble lmfaooo');
    }
    if (bet < 1) {
      return _.reply('It\'s gotta be a real number yeah?')
    }

    // Dice Rolls
    const { util } = this.client;
    let userD = util.random('num', [1, 12]);
    let botD = util.random('num', [1, 12]);

    // Visuals and DB
    let winnings: number, won: number, percentWon: number, 
    description: string[], identifier: string, db: any, color: string;
    if (userD > botD) {
      // Win
      let winnings = Math.random() * 1.5;
      if (winnings < 0.3) winnings += 0.3;
      won = Math.round(bet * winnings);
      won = won + Math.round(won * (multi / 100));
      if (won > maxWin) won = maxWin;
      percentWon = Math.round(won / bet * 100);
      db = await this.client.db.currency.addPocket(user.id, won);
      identifier = 'winning';
      color = 'GREEN';
      description = [
        `**Winner! You won __${percentWon}%__ of your bet.**`,
        `You won **${won.toLocaleString()}** coins.\n`,
        `You now have **${db.pocket.toLocaleString()}** coins.`
      ];
    } else if (userD === botD) {
      // Ties
      bet = Math.round(bet / 4);
      db = await this.client.db.currency.removePocket(user.id, bet);
      identifier = 'tie';
      color = 'YELLOW';
      description = [
        `**We Tied! Our dice are on same side.**`,
        `You lost **${bet.toLocaleString()}** coins.\n`,
        `You now have **${db.pocket.toLocaleString()}** coins.`
      ];
    } else if (userD < botD) {
      // Lost 
      db = await this.client.db.currency.removePocket(user.id, bet);
      identifier = 'losing';
      color = 'RED';
      description = [
        `**You lost! My dice is higher than yours.**`,
        `You lost **${bet.toLocaleString()}** coins.\n`,
        `You now have **${db.pocket.toLocaleString()}** coins.`
      ];
    }

    // Message
    return channel.send({ embed: {
      author: { 
        name: `${user.username}'s ${identifier} gambling game`,
        iconURL: user.avatarURL({ dynamic: true }) },
      color, description: description.join('\n'),
      fields: [
        { name: user.username, value: `Rolled a \`${userD}\``, inline: true },
        { name: this.client.user.username, value: `Rolled a \`${botD}\``, inline: true },
      ],
      footer: { 
        text: `Multiplier: ${multi}%`,
        iconURL: this.client.user.avatarURL() }
    }});
  }
}