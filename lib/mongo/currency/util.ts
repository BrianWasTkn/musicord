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
    if (
      msg.member.nickname &&
      msg.member.nickname.toLowerCase().includes('taken')
    ) {
      unlocked.push(`Taken Cult — \`5%\``);
      total += 5;
    }
    if (channel.name.includes('lava')) {
      unlocked.push(`#lava — \`2.5%\``);
      total += 2.5;
    }
    if (msg.guild.emojis.cache.size >= 100) {
      total += 1;
      unlocked.push(`100 Server Emojis — \`1%\``);
      if (msg.guild.emojis.cache.size >= 250) {
        total += 2.5;
        unlocked.push(`250 Server Emojis — \`2.5%\``);
      }
    }

    // Currency-based (10%)
    const items = bot.handlers.item.modules;
    const trophyItem = items.get('trophy');
    const coffeeItem = items.get('coffee');
    if (db.items.length < 1) {
      const db = await bot.db.currency.updateItems(msg.author.id);
      return await CalcMulti(bot, msg);
    }

    let trophy = db.items.find((i) => i.id === trophyItem.id);
    let coffee = db.items.find((i) => i.id === coffeeItem.id);

    if (trophy.amount >= 1) {
      let multi = 2.5 * trophy.amount;
      total += multi;
      unlocked.push(`Trophy Effects — \`${multi}%\``);
    }

    if (coffee.active && (coffee.expire > Date.now())) {
      total += coffee.multi;
      unlocked.push(`Baddd's Coffee — \`${coffee.multi}%\``);
    } else {
      coffee.multi = 0;
      coffee.expire = 0;
      coffee.active = false;
      await db.save()
    }

    return { total, unlocked };
  },
};
