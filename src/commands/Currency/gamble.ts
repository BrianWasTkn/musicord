import { MessageOptions, Collection } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
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
      description: 'Totally not rigged gambling game for grinders.',
      category: 'Currency',
      cooldown: 3000,
      args: [
        {
          id: 'amount',
          type: 'gambleAmount',
        },
      ],
    });
  }

  public async exec(
    msg: MessagePlus,
    args: {
      amount?: number;
    }
  ): Promise<string | MessageOptions> {
    const {
      util,
      util: { effects },
      config: { currency },
      db: { currency: DB },
    } = this.client;

    // Core
    const { maxWin, maxMulti, maxBet } = currency;
    const data = await msg.author.fetchDB();
    let { total: multi } = DB.utils.calcMulti(this.client, msg, data);
    const { amount: bet } = args;
    if (multi >= maxMulti) multi = maxMulti as number;
    if (!bet) return;

    // Item Effects
    let extraWngs: number = 0;
    for (const it of ['thicc', 'brian']) {
      if (!effects.has(msg.author.id)) effects.set(msg.author.id, new Collection<string, Effects>().set(it, new Effects()));
      if (effects.get(msg.author.id).has(it)) {
        extraWngs += effects.get(msg.author.id).get(it).winnings
      }
    }

    // Dice
    let userD = util.randomNumber(1, 12);
    let botD = util.randomNumber(1, 12);
    if (Math.random() > 0.65) {
      userD = (botD > userD ? [botD, (botD = userD)] : [userD])[0];
    } else {
      botD = (userD > botD ? [userD, (userD = botD)] : [botD])[0];
    }

    // vis and db
    let w: number,
      perwn: number,
      description: string[],
      identifier: string,
      color: string;

    if (botD === userD || botD > userD) {
      const ties = botD === userD;
      let lost = ties ? Math.round(bet / 4) : bet;

      const d = await msg.author.initDB(data).updateItems().removePocket(bet).calcSpace().db.save();
      identifier = ties ? 'tie' : 'losing';
      color = ties ? 'YELLOW' : 'RED';
      description = [
        `You lost **${lost.toLocaleString()}**\n`,
        `You now have **${(d.pocket).toLocaleString()}**`,
      ];
    } else if (userD > botD) {
      let wngs = Math.random() * 1.5;
      wngs += extraWngs;
      w = Math.ceil(bet * wngs);
      w = w + Math.round(w * (multi / 100));
      if (w > maxWin) w = maxWin as number;
      perwn = Number((w / bet).toFixed(2));

      const d = await msg.author.initDB(data).updateItems().addPocket(w).calcSpace().db.save();
      
      identifier = Boolean(extraWngs) ? 'thicc' : 'winning';
      color = Boolean(extraWngs) ? 'BLUE' : 'GREEN';
      description = [
        `You won **${w.toLocaleString()}**\n`,
        `**Multiplier** \`x${perwn.toLocaleString()}\``,
        `You now have **${(d.pocket).toLocaleString()}**`,
      ];
    }

    const embed = new Embed()
      .setAuthor(
        `${msg.author.username}'s ${identifier} gambling game`,
        msg.author.displayAvatarURL({ dynamic: true })
      )
      .setFooter(false, `Multiplier: ${multi}%`, this.client.user.avatarURL())
      .addField(msg.author.username, `Rolled a \`${userD}\``, true)
      .addField(this.client.user.username, `Rolled a \`${botD}\``, true)
      .setDescription(description.join('\n'))
      .setColor(color);

    return { embed };
  }
}
