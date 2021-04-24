import { MessageOptions, Collection } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Argument } from 'discord-akairo';
import { Document } from 'mongoose';

import { CurrencyProfile } from 'lib/interface/mongo/currency';
import { InventorySlot } from 'lib/interface/handlers/item';
import { Command } from 'lib/handlers/command';
import { Effects } from 'lib/utility/effects';
import { Embed } from 'lib/utility/embed';
import { Item } from 'lib/handlers/item';
import config from 'config/index';

export default class Currency extends Command {
  constructor() {
    super('bet', {
      aliases: ['gamble', 'roll', 'bet'],
      channel: 'guild',
      description: 'Play a dice game by rolling a d12 dice!',
      category: 'Currency',
      cooldown: 5e3,
      args: [
        {
          id: 'amount',
          type: 'gambleAmount',
        },
      ],
    });
  }

  async exec(
    ctx: Context<{ amount: number }>
  ): Promise<string | MessageOptions> {
    const {
      util,
      util: { effects },
      db: { currency: DB },
    } = ctx.client;

    // Core
    const { maxWin, minBet, maxBet, maxPocket } = config.currency;
    const userEntry = await ctx.db.fetch();
    const { data } = userEntry;
    let { total: multi } = DB.utils.calcMulti(ctx, data);

    // Args
    const { amount: bet } = ctx.args;
    const args = ((bet: number) => {
      let state = false;
      switch (true) {
        case data.pocket <= 0:
          return { state, m: "You don't have coins to gamble!" };
        case data.pocket >= maxPocket: 
          return { state, m: `You're too rich (${maxPocket.toLocaleString()}) to gamble!` };
        case bet > data.pocket:
          return { state, m: `You only have **${data.pocket}** coins don't lie to me hoe.` };
        case !bet:
          return { state, m: 'You need something to gamble!' };
        case bet < 1:
          return { state, m: 'It has to be a real number greater than 0 yeah?' };
        case bet < minBet:
          return { state, m: `You can't gamble lower than **${minBet}** coins sorry` };
        case bet > maxBet:
          return { state, m: `You can't gamble higher than **${maxBet.toLocaleString()}** coins sorry` };
        default:
          return { state: true, m: null };
      }
    })(bet);
    if (!args.state) {
      return { content: args.m, replyTo: ctx.id };
    }

    // Item Effects
    const iDiceEffs: Item[] = [];
    let extraWngs: number = 0;
    let dceRoll: number = 0;
    for (const it of ['thicc', 'brian', 'dragon', 'trophy']) {
      const userEf = effects.get(ctx.author.id);
      if (!userEf) {
        const col = new Collection<string, Effects>().set(it, new Effects());
        effects.set(ctx.author.id, col);
      }
      if (effects.get(ctx.author.id).has(it)) {
        if (it === 'dragon')
          iDiceEffs.push(this.client.handlers.item.modules.get(it));
        const i = effects.get(ctx.author.id).get(it);
        extraWngs += i.gambleWinnings;
        dceRoll += i.gambleDice;
      }
    }

    // Dice
    const rig = (a: number, b: number) => (a > b ? [b, a] : [a, b]);
    let userD = util.randomNumber(1, 12);
    let botD = util.randomNumber(1, 12);
    if (Math.random() > 0.55) {
      [userD, botD] = rig(botD, userD);
    } else {
      [botD, userD] = rig(userD, botD);
    }
    userD += dceRoll;

    // vis and db
    let perwn: number, description: string[], identifier: string, color: string;

    if (botD === userD || botD > userD) {
      const ties = botD === userD;
      const lost = ties ? Math.round(bet / 4) : bet;
      await userEntry.removePocket(lost).updateItems().calcSpace().updateStats('lost', lost).updateStats('loses').save();

      identifier = ties ? 'tie' : 'losing';
      color = ties ? 'YELLOW' : 'RED';
      description = [
        `You lost **${lost.toLocaleString()}**\n`,
        `You now have **${(data.pocket - lost).toLocaleString()}**`,
      ];
    } else if (userD > botD) {
      let wngs = Math.ceil(bet * (Math.random() + (0.4 + extraWngs)));
      wngs = Math.min(maxWin, wngs + Math.ceil(wngs * (multi / 100)));
      perwn = Math.round((wngs / bet) * 100);

      await userEntry.addPocket(wngs).updateItems().calcSpace().updateStats('won', wngs).updateStats('wins').save();
      identifier = Boolean(extraWngs) ? 'powered' : 'winning';
      color = Boolean(extraWngs) ? 'BLUE' : 'GREEN';
      description = [
        `You won **${wngs.toLocaleString()}**\n`,
        `**Percent Won** \`${perwn}%${
          extraWngs ? ` (${Math.round(perwn - (extraWngs * 100))}% original)` : ''
        }\``,
        `You now have **${(data.pocket + wngs).toLocaleString()}**`,
      ];
    }

    return {
      embed: {
        color,
        description: description.join('\n'),
        footer: {
          text: `Multiplier: ${multi}%`,
          iconURL: ctx.client.user.avatarURL(),
        },
        author: {
          name: `${ctx.author.username}'s ${identifier} gambling game`,
          iconURL: ctx.author.displayAvatarURL({ dynamic: true }),
        },
        fields: [
          {
            name: `${ctx.author.username}`,
            value: `Rolled a \`${userD}\` ${
              iDiceEffs.length >= 1
                ? iDiceEffs.map((i) => i.emoji).join(' ')
                : ''
            }`,
            inline: true,
          },
          {
            name: `${ctx.client.user.username}`,
            value: `Rolled a \`${botD}\``,
            inline: true,
          },
        ],
      },
    };
  }
}
