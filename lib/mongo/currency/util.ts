/**
 * Currency Utility
 * Author: brian
 */

import type { Message, GuildChannel } from 'discord.js';
import type { CurrencyProfile } from '@lib/interface/mongo/currency';
import type { InventorySlot } from '@lib/interface/handlers/item';
import type { CurrencyUtil } from '@lib/interface/mongo/currency';
import type { Lava } from '@lib/Lava';
import { Document } from 'mongoose';

async function newItem(bot: Lava, userID: string, itemID: string) {
  const dat = await bot.db.currency.fetch(userID);
  dat.items.push({
    active: false,
    amount: 0,
    expire: 0,
    id: itemID,
  });

  await dat.save();
  return dat;
}

export const utils: CurrencyUtil = {
  /**
   * calc the multi of user
   * @param Lava an extended instance of akairo client
   * @param msg a discord msg obj
   * @returns {Promise<number>}
   */
  calcMulti: async function CalcMulti(
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
      unlocked.push(`${msg.guild.name} — \`10%\``);
      total += 10;
    }
    if (msg.member.nickname) {
      const includes = name => msg.member.nickname
        .toLowerCase()
        .includes(name);

      if (includes('taken')) {
        let m = 10;
        total += m;
        unlocked.push(`Taken Cult — \`${m}%\``)
      }
      else if (includes('probber')) {
        let m = 3.5;
        total += m;
        unlocked.push(`Probber Cult — \`${m}%\``)
      }
      else if (includes('chips')) {
        let m = 3.5;
        total += m;
        unlocked.push(`Chips Cult — \`${m}%\``)
      }
    }
    if (channel.name.includes('・')) {
      unlocked.push(`Dotted Channel — \`2.5%\``);
      total += 2.5;
    }
    if (msg.guild.emojis.cache.size >= 100) {
      if (msg.guild.emojis.cache.size >= 250) {
        total += 2.5;
        unlocked.push(`250 Server Emojis — \`2.5%\``);
      }
    }

    // Currency-based (10%)
    const items = bot.handlers.item.modules;
    const trophyItem = items.get('trophy');
    const coffeeItem = items.get('coffee');
    const filter = item => i => i.id === item.id;
    const trophy = db.items.find(filter(trophyItem));
    const coffee = db.items.find(filter(coffeeItem));

    if (db.items.length < 1 || !trophy || !coffee) {
      await bot.db.currency.updateItems(msg.author.id);
      return await CalcMulti(bot, msg);
    }

    if (trophy.amount >= 1) {
      let multi = 2.5 * trophy.amount;
      total += multi;
      unlocked.push(`${trophyItem.name} — \`${multi}%\``);
    }

    if (coffee.active && (coffee.expire > Date.now())) {
      total += coffee.multi;
      unlocked.push(`${coffeeItem.name} — \`${coffee.multi}%\``);
    } else {
      coffee.active = false;
      await db.save()
    }

    return { total, unlocked };
  },
};
