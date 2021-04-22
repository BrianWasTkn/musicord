/**
 * Currency Utility
 * Author: brian
 */

import type { CurrencyProfile } from 'lib/interface/mongo/currency';
import type { InventorySlot } from 'lib/interface/handlers/item';
import type { CurrencyUtil } from 'lib/interface/mongo/currency';
import type { GuildChannel } from 'discord.js';
import type { Context } from 'lib/extensions/message';
import type { Item } from 'lib/handlers/item';
import type { Lava } from 'lib/Lava';
import { Document } from 'mongoose';
import config from 'config/index' ;

export const utils: CurrencyUtil = {
  /**
   * calc the multi of user
   * @param {Lava} bot an extended instance of akairo client
   * @param {Context} msg a discord msg obj
   */
  calcMulti: function CalcMulti(
    bot: Lava,
    ctx: Context,
    db: Document & CurrencyProfile
  ): { unlocked: string[]; total: number; multis: number } {
    const { maxMulti } = config.currency;
    const channel = ctx.channel as GuildChannel;
    let unlocked = [];
    let multis = 0;
    let total = 0;
    total += db.multi;

    // Discord-based
    if (ctx.guild.id === '691416705917779999') {
      unlocked.push(`${ctx.guild.name} — \`10%\``);
      multis++;
      total += 10;
    }
    if (ctx.member.nickname) {
      const includes = (name) =>
        ctx.member.nickname.toLowerCase().includes(name);

      if (includes('taken')) {
        let m = 10;
        multis++;
        total += m;
        unlocked.push(`Taken Cult — \`${m}%\``);
      }
      if (includes('probber')) {
        let m = 3.5;
        multis++;
        total += m;
        unlocked.push(`Probber Cult — \`${m}%\``);
      }
      if (includes('chips')) {
        let m = 3.5;
        multis++;
        total += m;
        unlocked.push(`Chips Cult — \`${m}%\``);
      }
    }
    if (channel.name.includes('・')) {
      total += 2.5;
      multis++;
      unlocked.push(`Dotted Channel — \`2.5%\``);
    }
    if (channel.name.includes('lava')) {
      total += 5;
      multis++;
      unlocked.push(`${channel.name} — \`5%\``);
    }
    if (ctx.guild.emojis.cache.size >= 420) {
      let m = 4.5;
      multis++;
      total += m;
      unlocked.push(`420 Server Emojis — \`${m}%\``);
    }
    if (ctx.guild.members.cache.size >= 1000) {
      let m = 1;
      multis++;
      total += m;
      unlocked.push(`1000+ Members — \`${m}%\``);
    }

    // Currency-based (10%)
    const items = bot.handlers.item.modules;
    for (const item of ['coffee', 'brian']) {
      const mod = items.get(item);
      const inv = db.items.find((i) => i.id === mod.id);
      if (inv.expire > Date.now()) {
        multis++;
        total += inv.multi;
        unlocked.push(`${mod.name} — \`${inv.multi}%\``);
      }
    }

    const trophyItem = items.get('trophy');
    const trophy = db.items.find((i) => i.id === trophyItem.id);
    if (trophy.amount >= 1) {
      let m = trophy.multi;
      multis++;
      total += m;
      unlocked.push(`${trophyItem.name} — \`${m}%\``);
    }

    total = Math.min(total, maxMulti);
    return { total, unlocked, multis };
  },
};
