/**
 * Currency Utility
 * Author: brian
 */

import type { Message, GuildChannel } from 'discord.js';
export type { CurrencyUtil } from '@lib/interface/mongo/currency';
import type { CurrencyUtil } from '@lib/interface/mongo/currency';
import type { Lava } from '@lib/Lava';

export const utils: CurrencyUtil = {
  /**
   * calc the multi of user
   * @param Lava an extended instance of akairo client
   * @param msg a discord msg obj
   * @returns {Promise<number>}
   */
  async calcMulti(
    bot: Lava,
    msg: Message
  ): Promise<{ unlocked: string[]; total: number }> {
    const { fetch } = bot.db.currency;
    const channel = msg.channel as GuildChannel;
    const db = await fetch(msg.author.id);
    let total = 0;
    total += db.multi;
    let unlocked = [];

    // Discord-based (26%)
    if (msg.guild.id === '691416705917779999') {
      unlocked.push(`${msg.guild.name} - \`10%\``);
      total += 10;
    }
    if (
      msg.member.nickname &&
      msg.member.nickname.toLowerCase().includes('taken')
    ) {
      unlocked.push(`Taken Cult - \`5%\``);
      total += 5;
    }
    if (channel.name.includes('lava')) {
      unlocked.push(`#lava - \`2.5%\``);
      total += 2.5;
    }
    if (msg.guild.id === '691416705917779999') {
      const g = await bot.guilds.fetch('691416705917779999');
      unlocked.push(`${g.id} — \`5%\``);
      total += 5;
    }
    if (msg.guild.emojis.cache.size >= 100) {
      total += 1;
      unlocked.push(`100 Emojis - \`1%\``);
      if (msg.guild.emojis.cache.size >= 250) {
        total += 2.5;
        unlocked.push(`250 Emojis - \`2.5%\``);
      }
    }

    // Currency-based (10%)
    const trophy = db.items.find((i) => i.id === 'trophy');
    if (!trophy) {
      db.items.push({
        active: false,
        id: bot.handlers.item.modules
          .find(i => i.name.toLocaleLowerCase().includes('trophy')).id,
        amount: 0,
        expire: 0
      });

      await db.save();
    }
    if (trophy.amount >= 1) {
      let multi = 1.25 * trophy.amount;
      total += multi;
      unlocked.push(`Trophy — \`${multi}%\``);
    }

    return { total, unlocked };
  },
};
