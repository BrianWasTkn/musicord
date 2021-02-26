import { Message, MessageEmbed } from 'discord.js';
import { Argument, Command } from 'discord-akairo';
import { Document } from 'mongoose';

export default class Currency extends Command {
  public client: Akairo.Client;

  constructor() {
    super('bet', {
      aliases: ['gamble', 'roll', 'bet'],
      channel: 'guild',
      description: "Completely unrigged gambling game if you're wondering",
      category: 'Currency',
      cooldown: 5000,
      args: [
        {
          id: 'amount',
          type: Argument.union('number', 'string'),
        },
      ],
    });
  }

  private async checkArgs(_: Message, args: any): Promise<string | number> {
    const {
      minBet,
      maxBet,
      maxPocket,
    } = this.client.config.currency.gambleCaps;
    const { pocket } = await this.client.db.currency.fetch(_.author.id);
    let bet = args.amount;

    // no bet amounts
    if (!bet) return 'You need something to gamble';

    // transform arguments
    if (isNaN(bet)) {
      if (bet === 'all') {
        bet = pocket;
      } else if (bet === 'half') {
        bet = Math.round(pocket / 2);
      } else if (bet === 'max') {
        bet = pocket > maxBet ? maxBet : pocket;
      } else if (bet === 'min') {
        bet = minBet;
      } else {
        return 'You actually need a number to bet...';
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
    if (pocket > maxPocket) return `You're too rich to dice the gamble`;
    if (bet < 1) return 'It should be a positive number yeah?';

    // else return something
    return bet;
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const {
      util,
      db: { currency: DB },
      config: { currency },
    } = this.client;

    const { maxWin, maxMulti } = currency.gambleCaps;
    let { total: multi } = await DB.util.calcMulti(this.client, _);
    if (multi >= maxMulti) multi = maxMulti;
    const bet = await this.checkArgs(_, args);
    if (typeof bet === 'string') return _.channel.send(bet);

    // Dice Rolls
    const userD = util.randomNumber(1, 12);
    const botD = util.randomNumber(1, 12);

    // Visuals and DB
    let won: number,
      percentWon: number,
      description: string[],
      identifier: string,
      db: Document & Lava.CurrencyProfile,
      color: string;

    if (botD === userD || botD > userD) {
      const ties = botD === userD;
      let lost = ties ? Math.round(bet / 4) : bet;
      db = await DB.removePocket(_.author.id, lost);

      identifier = ties ? 'tie' : 'losing';
      color = ties ? 'YELLOW' : 'RED';
      description = ties
        ? [
            `**We Tied! Our dice are on same side.**`,
            `You lost **${bet.toLocaleString()}** coins.\n`,
            `You now have **${db.pocket.toLocaleString()}** coins.`,
          ]
        : [
            `**You lost! My dice is higher than yours.**`,
            `You lost **${bet.toLocaleString()}** coins.\n`,
            `You now have **${db.pocket.toLocaleString()}** coins.`,
          ];
    } else if (userD > botD) {
      let winnings = Math.random();
      if (winnings < 0.3) winnings += 0.3;
      won = Math.round(bet * winnings);
      won = won + Math.round(won * (multi / 100));
      if (won > maxWin) won = maxWin;
      percentWon = Math.round((won / bet) * 100);
      db = await DB.addPocket(_.author.id, won);

      identifier = 'winning';
      color = 'GREEN';
      description = [
        `**Winner! You won __${percentWon}%__ of your bet.**`,
        `You won **${won.toLocaleString()}** coins.\n`,
        `You now have **${db.pocket.toLocaleString()}** coins.`,
      ];
    }

    // Message
    return _.channel.send({
      embed: new MessageEmbed()
        .setAuthor(
          `${_.author.username}'s ${identifier} gambling game`,
          _.author.displayAvatarURL({ dynamic: true })
        )
        .setColor(color)
        .setDescription(description.join('\n'))
        .addField(_.author.username, `Rolled a \`${userD}\``, true)
        .addField(this.client.user.username, `Rolled a \`${botD}\``, true)
        .setFooter(`Multiplier: ${multi}%`, this.client.user.avatarURL()),
    });
  }
}
