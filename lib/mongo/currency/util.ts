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
    const { updateItems } = bot.db.currency;
    const channel = msg.channel as GuildChannel;
    const db = await updateItems(msg.author.id);
    let total = 0;
    total += db.multi;
    let unlocked = [];

    // Discord-based
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
      if (includes('probber')) {
        let m = 3.5;
        total += m;
        unlocked.push(`Probber Cult — \`${m}%\``)
      }
      if (includes('chips')) {
        let m = 3.5;
        total += m;
        unlocked.push(`Chips Cult — \`${m}%\``)
      }
    }
    if (channel.name.includes('・')) {
      unlocked.push(`Dotted Channel — \`2.5%\``);
      total += 2.5;
    }
    if (channel.name.includes('lava')) {
      unlocked.push(`${channel.name} — \`5%\``);
      total += 5;
    }
    if (msg.guild.emojis.cache.size >= 420) {
      total += 4.5;
      unlocked.push(`420 Server Emojis — \`2.5%\``);
    }

    // Currency-based (10%)
    const items = bot.handlers.item.modules;
    const trophyItem = items.get('trophy');
    const coffeeItem = items.get('coffee');
    const heartItem = items.get('heart');
    const filter = item => i => i.id === item.id;
    const trophy = db.items.find(filter(trophyItem));
    const coffee = db.items.find(filter(coffeeItem));
    const heart = db.items.find(filter(heartItem));

    if (trophy.amount >= 1) {
      let multi = 10 * trophy.amount;
      total += multi;
      unlocked.push(`${trophyItem.name} — \`${multi}%\``);
    }

    if (coffee.active && (coffee.expire > Date.now())) {
      total += coffee.multi;
      unlocked.push(`${coffeeItem.name} — \`${coffee.multi}%\``);
    } else {
      if (coffee.active) {
        coffee.active = false;
        await db.save();
      }
    }

    if (heart.active && (heart.expire > Date.now())) {
      total += heart.multi;
      unlocked.push(`${heartItem.name} — \`${heart.multi}%\``);
    } else {
      if (heart.active) {
        heart.active = false;
        await db.save();
      }
    }

    return { total, unlocked };
  },
};
