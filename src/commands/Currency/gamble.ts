import { Message, MessageOptions } from 'discord.js';
import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { Document } from 'mongoose';
import { Argument } from 'discord-akairo';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('bet', {
      aliases: ['gamble', 'roll', 'bet'],
      channel: 'guild',
      description: 'A very rigged gambling game for lava grinders.',
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

  private async checkArgs(
    _: Message,
    args: {
      amount: number | string;
    }
  ): Promise<string | number> {
    const { minBet, maxBet, maxPocket } = this.client.config.currency;
    const { pocket } = await this.client.db.currency.fetch(_.author.id);
    let bet = args.amount;

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

  public async exec(_: Message, args: any): Promise<string | MessageOptions> {
    const {
      util,
      db: { currency: DB },
      config: { currency },
    } = this.client;

    const { maxWin, maxMulti, maxBet } = currency;
    let { total: multi } = await DB.utils.calcMulti(this.client, _);
    if (multi >= maxMulti) multi = maxMulti as number;
    const bet = await this.checkArgs(_, args);
    if (typeof bet === 'string') return bet;

    let userD = util.randomNumber(1, 12);
    let botD = util.randomNumber(1, 12);
    if (Math.random() > 0.7)
      if (botD > userD)
        // best rig ever
        userD = [botD, (botD = userD)][0];
      else if (userD > botD) botD = [userD, (userD = botD)][0];

    // vis and db
    let w: number,
      perwn: number,
      description: string[],
      identifier: string,
      db: Document & CurrencyProfile,
      color: string;

    if (botD === userD || botD > userD) {
      const ties = botD === userD;
      let lost = ties ? Math.round(bet / 4) : bet;
      db = await DB.remove(_.author.id, 'pocket', lost);

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
      let wngs = Math.random() * (<number>maxWin / <number>maxBet);
      if (wngs < 0.3) wngs += 0.3;
      w = Math.round(bet * wngs);
      w = w + Math.round(w * (multi / 100));
      if (w > maxWin) w = maxWin as number;
      perwn = Math.round((w / bet) * 100);
      db = await DB.add(_.author.id, 'pocket', w);

      identifier = 'winning';
      color = 'GREEN';
      description = [
        `**Winner! You won __${perwn}%__ of your bet.**`,
        `You won **${w.toLocaleString()}** coins.\n`,
        `You now have **${db.pocket.toLocaleString()}** coins.`,
      ];
    }

    const embed = new Embed()
      .setAuthor(
        `${_.author.username}'s ${identifier} gambling game`,
        _.author.displayAvatarURL({ dynamic: true })
      )
      .setFooter(false, `Multiplier: ${multi}%`, this.client.user.avatarURL())
      .addField(this.client.user.username, `Rolled a \`${botD}\``, true)
      .addField(_.author.username, `Rolled a \`${userD}\``, true)
      .setDescription(description.join('\n'))
      .setColor(color);

    return { embed };
  }
}
