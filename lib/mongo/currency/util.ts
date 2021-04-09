/**
 * Currency Utility
 * Author: brian
 */

import type { CurrencyProfile } from '@lib/interface/mongo/currency';
import type { InventorySlot } from '@lib/interface/handlers/item';
import type { CurrencyUtil } from '@lib/interface/mongo/currency';
import type { GuildChannel } from 'discord.js';
import type { MessagePlus } from '@lib/extensions/message';
import type { Item } from '@lib/handlers/item';
import type { Lava } from '@lib/Lava';
import { Document } from 'mongoose';

export const utils: CurrencyUtil = {
  /**
   * calc the multi of user
   * @param {Lava} bot an extended instance of akairo client
   * @param {MessagePlus} msg a discord msg obj
   * @returns {Promise<number>}
   */
  calcMulti: function CalcMulti(
    bot: Lava,
    msg: MessagePlus,
    db: Document & CurrencyProfile
  ): { unlocked: string[]; total: number } {
    const { maxMulti } = bot.config.currency;
    const channel = msg.channel as GuildChannel;
    let unlocked = [];
    let total = 0;
    total += db.multi;

    // Discord-based
    if (msg.guild.id === '691416705917779999') {
      unlocked.push(`${msg.guild.name} — \`10%\``);
      total += 10;
    }
    if (msg.member.nickname) {
      const includes = (name) =>
        msg.member.nickname.toLowerCase().includes(name);

      if (includes('taken')) {
        let m = 10;
        total += m;
        unlocked.push(`Taken Cult — \`${m}%\``);
      }
      if (includes('probber')) {
        let m = 3.5;
        total += m;
        unlocked.push(`Probber Cult — \`${m}%\``);
      }
      if (includes('chips')) {
        let m = 3.5;
        total += m;
        unlocked.push(`Chips Cult — \`${m}%\``);
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
    if (msg.guild.members.cache.size >= 1000) {
      total += 1;
      unlocked.push(`1000+ Members — \`1%\``);
    }

    // Currency-based (10%)
    const items = bot.handlers.item.modules;
    for (const item of ['coffee', 'brian']) {
      const mod = items.get(item);
      const inv = db.items.find((i) => i.id === mod.id);
      if (inv.expire > Date.now()) {
        total += inv.multi;
        unlocked.push(`${mod.name} — \`${inv.multi}%\``);
      }
    }

    const trophyItem = items.get('trophy');
    const trophy = db.items.find((i) => i.id === trophyItem.id);
    if (trophy.amount >= 1) {
      let multi = trophy.multi;
      total += multi;
      unlocked.push(`${trophyItem.name} — \`${multi}%\``);
    }

    total = Math.min(total, maxMulti);
    return { total, unlocked };
  },
};
