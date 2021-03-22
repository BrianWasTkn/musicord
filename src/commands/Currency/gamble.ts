import { Message, MessageOptions, Collection } from 'discord.js';
import { Document } from 'mongoose';
import { Argument } from 'discord-akairo';

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

  async before(msg: Message) {
    const { effects } = this.client.util;
    const data = await this.client.db.currency.fetch(msg.author.id);
    const items = this.client.handlers.item.modules.array();
    const eff = new Effects();

    for (const item of items) {
      const inv = data.items.find(i => i.id === item.id);
      if (inv.expire > Date.now()) {
        if (item.id === 'brian') eff.setWinnings(0.5).setSlotOdds(5);
        if (item.id === 'thicc') eff.setWinnings(0.5);
        if (item.id === 'crazy') eff.setSlotOdds(5);
        const temp = new Collection<string, Effects>();
        temp.set(item.id, new Effects());
        if (!effects.has(msg.author.id)) effects.set(msg.author.id, temp);
        effects.get(msg.author.id).set(item.id, eff);
      } else {
        const useref = effects.get(msg.author.id) ;
        if (!useref || useref.has(item.id)) {
          const meh = new Collection<string, Effects>();
          meh.set(item.id, new Effects());
          effects.set(msg.author.id, meh)
        }
      }
    }
  }
  
  public async exec(
    _: Message,
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
    const data = await DB.fetch(_.author.id);
    let { total: multi } = await DB.utils.calcMulti(this.client, _);
    const { amount: bet } = args;
    if (multi >= maxMulti) multi = maxMulti as number;
    if (!bet) return;

    // Item Effects
    let extraWngs: number = 0;
    for (const it of ['thicc', 'brian']) {
      if (!effects.has(_.author.id)) effects.set(_.author.id, new Collection<string, Effects>().set(it, new Effects()));
      if (effects.get(_.author.id).has(it)) {
        extraWngs += effects.get(_.author.id).get(it).winnings
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
      data.pocket -= lost;

      identifier = ties ? 'tie' : 'losing';
      color = ties ? 'YELLOW' : 'RED';
      description = [
        `You lost **${lost.toLocaleString()}**\n`,
        `You now have **${data.pocket.toLocaleString()}**`,
      ];
    } else if (userD > botD) {
      let wngs = Math.random() * 2;
      if (wngs < 0.3) wngs += 0.3;
      wngs += extraWngs;
      w = Math.round(bet * wngs);
      w = w + Math.round(w * (multi / 100));
      if (w > maxWin) w = maxWin as number;
      perwn = Number((w / bet).toFixed(2));
      data.pocket += w;

      identifier = Boolean(extraWngs) ? 'thicc' : 'winning';
      color = Boolean(extraWngs) ? 'BLUE' : 'GREEN';
      description = [
        `You won **${w.toLocaleString()}**\n`,
        `**Multiplier** \`x${perwn.toLocaleString()}\``,
        `You now have **${data.pocket.toLocaleString()}**`,
      ];
    }

    const embed = new Embed()
      .setAuthor(
        `${_.author.username}'s ${identifier} gambling game`,
        _.author.displayAvatarURL({ dynamic: true })
      )
      .setFooter(false, `Multiplier: ${multi}%`, this.client.user.avatarURL())
      .addField(_.author.username, `Rolled a \`${userD}\``, true)
      .addField(this.client.user.username, `Rolled a \`${botD}\``, true)
      .setDescription(description.join('\n'))
      .setColor(color);

    await data.save()
    return { embed };
  }
}
