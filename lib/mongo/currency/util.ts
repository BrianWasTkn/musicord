/**
 * Currency Utility
 * Author: brian
 */

import type { InventorySlot } from 'lib/interface/handlers/item';
import type { CurrencyUtil } from 'lib/interface/mongo/currency';
import type { GuildChannel } from 'discord.js';
import type { Context } from 'lib/extensions/message';
import type { Item } from 'lib/handlers/item';
import type { Lava } from 'lib/Lava';
import config from 'config/index' ;

export const utils: CurrencyUtil = {
  /**
   * calc the multi of user
   * @param {Lava} bot an extended instance of akairo client
   * @param {Context} msg a discord msg obj
   */
  calcMulti: function CalcMulti(
    ctx: Context, db: CurrencyProfile
  ): { unlocked: string[]; total: number; multis: number } {
    const { maxMulti } = config.currency;
    const channel = ctx.channel as GuildChannel;
    let unlocked = [];
    let multis = 0;
    let total = 0;
    total += db.multi;

    // Discord-based
    multis++;
    if (ctx.guild.id === '691416705917779999') {
      unlocked.push(`${ctx.guild.name} — \`10%\``);
      total += 10;
    }
    if (ctx.member.nickname) {
      const includes = (name) =>
        ctx.member.nickname.toLowerCase().includes(name);

      multis += 3;
      if (includes('taken')) {
        let m = 10;
        total += m;
        unlocked.push(`Taken Cult — \`${m}%\``);
      }
      else if (includes('probber')) {
        let m = 3.5;
        total += m;
        unlocked.push(`Probber Cult — \`${m}%\``);
      }
      else if (includes('chips')) {
        let m = 3.5;
        total += m;
        unlocked.push(`Chips Cult — \`${m}%\``);
      }
    }
    multis++;
    if (channel.name.includes('・')) {
      total += 2.5;
      unlocked.push(`Dotted Channel — \`2.5%\``);
    }
    multis++;
    if (channel.name.includes('lava')) {
      total += 5;
      unlocked.push(`${channel.name} — \`5%\``);
    }
    multis++;
    if (ctx.guild.emojis.cache.size >= 420) {
      let m = 4.5;
      total += m;
      unlocked.push(`420 Server Emojis — \`${m}%\``);
    }
    multis++;
    if (ctx.guild.members.cache.size >= 1000) {
      let m = 1;
      total += m;
      unlocked.push(`1000+ Members — \`${m}%\``);
    }

    // Currency-based (10%)
    const items = ctx.client.handlers.item.modules;
    for (const item of ['coffee', 'brian']) {
      const mod = items.get(item);
      const inv = db.items.find((i) => i.id === mod.id);
      multis++;
      if (inv.expire > Date.now()) {
        total += inv.multi;
        unlocked.push(`${mod.name} — \`${inv.multi}%\``);
      }
    }

    const trophyItem = items.get('trophy');
    const trophy = db.items.find((i) => i.id === trophyItem.id);
    multis++;
    if (trophy.amount >= 1) {
      let m = trophy.multi * trophy.amount;
      total += m;
      unlocked.push(`${trophyItem.name} — \`${m}%\``);
    }

    total = Math.min(total, maxMulti);
    return { total, unlocked, multis };
  },
};
