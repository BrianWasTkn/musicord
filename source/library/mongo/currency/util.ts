/**
 * Currency Utility
 * Author: brian
 */

import type { GuildChannel } from 'discord.js';
import type { Context } from 'lib/extensions';
import type { Item } from 'lib/objects';
import type { Lava } from 'lib/Lava';
import config from 'config/index' ;

export interface CurrencyUtil {
  calcMulti: (ctx: Context, db: CurrencyProfile) => {
	unlocked: string[];
	multis: number;
	total: number;
  }
}

export const utils: CurrencyUtil = {
  /**
   * Calculate the multipliers of user context.
  */
  calcMulti: function CalcMulti(this: CurrencyUtil, ctx: Context, db: CurrencyProfile) {
	const { maxMulti } = config.currency;
	let unlocked = [];
	let multis = 0;
	let total = 0;
	total += db.multi;

	// Discord-based
	multis++;
	if (ctx.guild.id === '691416705917779999') {
	  total += 10;
	  unlocked.push(`${ctx.guild.name} — \`10%\``);
	}
	if (ctx.member.nickname) {
	  const includes = (name: string) => {
		return ctx.member.nickname.toLowerCase().includes(name);
	  };

	  multis += 3;
	  if (includes('taken')) {
		let m = 10; total += m;
		unlocked.push(`Taken Cult — \`${m}%\``);
	  }
	  if (includes('probber')) {
		let m = 3.5; total += m;
		unlocked.push(`Probber Cult — \`${m}%\``);
	  }
	  if (includes('chips')) {
		let m = 3.5; total += m;
		unlocked.push(`Chips Cult — \`${m}%\``);
	  }
	}
	multis++;
	if ((ctx.channel as GuildChannel).name.includes('・')) {
	  total += 2.5;
	  unlocked.push(`Dotted Channel — \`2.5%\``);
	}
	multis++;
	if ((ctx.channel as GuildChannel).name.includes('lava')) {
	  total += 5;
	  unlocked.push(`${(ctx.channel as GuildChannel).name} — \`5%\``);
	}
	multis++;
	if (ctx.guild.emojis.cache.size >= 420) {
	  let m = 4.5; total += m;
	  unlocked.push(`420 Server Emojis — \`${m}%\``);
	}
	multis++;
	if (ctx.guild.members.cache.size >= 1000) {
	  let m = 1; total += m;
	  unlocked.push(`1000+ Members — \`${m}%\``);
	}

	// Currency-based
	const items = ctx.client.handlers.item.modules;
	for (const item of ['coffee', 'brian']) {
	  multis++;
	  const mod = items.get(item);
	  const inv = mod.findInv(db.items);
	  if (inv.expire > Date.now()) {
		total += inv.multi;
		unlocked.push(`${mod.name} — \`${inv.multi}%\``);
	  }
	}
	const trophyItem = items.get('trophy');
	const trophy = trophyItem.findInv(db.items);
	multis++;
	if (trophy.amount >= 1) {
	  let m = 30/* * trophy.amount*/; total += m;
	  unlocked.push(`${trophyItem.name} — \`${m}%\``);
	}
	multis++;
	if (db.stats.prestige >= 1) {
	  const { toRoman } = ctx.client.util;
	  let m = 4 * db.stats.prestige; total += m;
	  unlocked.push(`Mastery ${toRoman(db.stats.prestige)} — \`${m}%\``);
	}

	total = Math.min(total, maxMulti);
	return { total, unlocked, multis };
  },
};
