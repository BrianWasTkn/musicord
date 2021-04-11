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
    const { maxWin, maxBet } = currency;
    const data = await msg.author.fetchDB();
    let { total: multi } = DB.utils.calcMulti(this.client, msg, data);
    const { amount: bet } = args;
    if (!bet) return;

    // Item Effects
    const iDiceEffs: Item[] = [];
    let extraWngs: number = 0;
    let dceRoll: number = 0;
    for (const it of ['thicc', 'brian', 'dragon']) {
      const userEf = effects.get(msg.author.id);
      if (!userEf) {
        const col = new Collection<string, Effects>().set(it, new Effects());
        effects.set(msg.author.id, col);
      }
      if (effects.get(msg.author.id).has(it)) {
      	if (it === 'dragon') iDiceEffs.push(this.client.handlers.item.modules.get(it));
        const i = effects.get(msg.author.id).get(it);
        extraWngs += i.gambleWinnings;
        dceRoll += i.gambleDice;
      }
    }

    // Dice
    let userD = util.randomNumber(1, 12);
    let botD = util.randomNumber(1, 12);
    if (Math.random() > 0.55) {
      userD = (botD > userD ? [botD, (botD = userD)] : [userD])[0] + dceRoll;
    } else {
      botD = (userD > botD ? [userD, (userD = botD)] : [botD])[0];
    }
    
    // vis and db
    let perwn: number,
      description: string[],
      identifier: string,
      color: string;

    if (botD === userD || botD > userD) {
      const ties = botD === userD;
      let lost = ties ? Math.round(bet / 4) : bet;

      const d = await msg.author
        .initDB(data)
        .updateItems()
        .removePocket(lost)
        .calcSpace()
        .db.save();

      identifier = ties ? 'tie' : 'losing';
      color = ties ? 'YELLOW' : 'RED';
      description = [
        `You lost **${lost.toLocaleString()}**\n`,
        `You now have **${d.pocket.toLocaleString()}**`,
      ];
    } else if (userD > botD) {
      let wngs = Math.ceil(bet * (Math.random() + + extraWngs));
      wngs = Math.min(maxWin, wngs + Math.ceil(wngs * (multi / 100)));
      perwn = Number((wngs / bet * 100).toFixed(2));

      const d = await msg.author
        .initDB(data)
        .updateItems()
        .addPocket(wngs)
        .calcSpace()
        .db.save();

      identifier = Boolean(extraWngs) ? 'thicc' : 'winning';
      color = Boolean(extraWngs) ? 'BLUE' : 'GREEN';
      description = [
        `You won **${wngs.toLocaleString()}**\n`,
        `**Percent Won** \`${perwn}%\``,
        `You now have **${d.pocket.toLocaleString()}**`,
      ];
    }

    return { embed: {
      color, description: description.join('\n'),
      footer: {
        text: `Multiplier: ${multi}%`,
        iconURL: this.client.user.avatarURL()
      },
      author: {
        name: `${msg.author.username}'s ${identifier} gambling game`,
        iconURL: msg.author.displayAvatarURL({ dynamic: true })
      },
      fields: [
        {
          name: `${msg.author.username}`,
          value: `Rolled a \`${userD}\` ${iDiceEffs.length >= 1 ? iDiceEffs.map(i => i.emoji).join(' ') : ''}`,
          inline: true
        },
        {
          name: `${this.client.user.username}`,
          value: `Rolled a \`${botD}\``,
          inline: true
        }
      ]
    }};
  }
}
