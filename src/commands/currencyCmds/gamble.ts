import { MessageOptions, Collection } from 'discord.js';
import { Context } from '@lib/extensions/message';
import { Argument } from 'discord-akairo';
import { Document } from 'mongoose';

import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { InventorySlot } from '@lib/interface/handlers/item';
import { Command } from '@lib/handlers/command';
import { Effects } from '@lib/utility/effects';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

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
      config: { currency },
      db: { currency: DB },
    } = ctx.client;

    // Core
    const { maxWin, maxBet } = currency;
    const { data } = await ctx.db.fetch();
    let { total: multi } = DB.utils.calcMulti(this.client, ctx, data);
    const { amount: bet } = ctx.args;
    if (!bet) return;

    // Item Effects
    const iDiceEffs: Item[] = [];
    let extraWngs: number = 0;
    let dceRoll: number = 0;
    for (const it of ['thicc', 'brian', 'dragon']) {
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

      const d = await ctx.db
        .removePocket(lost)
        .updateItems()
        .calcSpace()
        .save();

      identifier = ties ? 'tie' : 'losing';
      color = ties ? 'YELLOW' : 'RED';
      description = [
        `You lost **${lost.toLocaleString()}**\n`,
        `You now have **${d.pocket.toLocaleString()}**`,
      ];
    } else if (userD > botD) {
      let wngs = Math.ceil(bet * (Math.random() + (0.3 + extraWngs)));
      wngs = Math.min(maxWin, wngs + Math.ceil(wngs * (multi / 100)));
      perwn = Math.round((wngs / bet) * 100);

      const d = await ctx.db.addPocket(wngs).updateItems().calcSpace().save();

      identifier = Boolean(extraWngs) ? 'powered' : 'winning';
      color = Boolean(extraWngs) ? 'BLUE' : 'GREEN';
      description = [
        `You won **${wngs.toLocaleString()}**\n`,
        `**Percent Won** \`${perwn}% ${
          extraWngs ? `(${perwn}% original)` : ''
        }\``,
        `You now have **${d.pocket.toLocaleString()}**`,
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
