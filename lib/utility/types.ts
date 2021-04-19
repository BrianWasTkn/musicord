import type { Context } from '@lib/extensions/message';
import type { Quest } from '@lib/handlers/quest';
import type { Item } from '@lib/handlers/item';
import type { Lava } from '@lib/Lava';
import Constants from './constants'

export const argTypes = (bot: Lava) => ({
  shopItem: (ctx: Context, phrase: string): Item | null => {
    if (!phrase || phrase.length <= 1) return null;
    const items = [...bot.handlers.item.modules.values()];
    return items.find((i) => {
      return (
        i.id.toLowerCase() === phrase.toLowerCase() ||
        i.name.toLowerCase() === phrase.toLowerCase() ||
        i.name.toLowerCase().includes(phrase.toLowerCase()) ||
        i.id.toLowerCase().includes(phrase.toLowerCase())
      );
    });
  },

  questQuery: (ctx: Context, phrase: string): Quest | string | null => {
    if (!phrase || phrase.length <= 2) return null;
    if (phrase.toLowerCase() === 'stop') return 'stop';
    if (phrase.toLowerCase() === 'check') return 'check';

    const quests = bot.handlers.quest.modules;
    const search = quests.get(phrase.toLowerCase());
    if (!search) {
      phrase = phrase.toLowerCase();
      const search = quests.array().find(q => {
        return q.name.toLowerCase() === phrase
        || q.name.toLowerCase().includes(phrase);
      });

      return search || null;
    }

    return search || null;
  },

  gambleAmount: async (
    ctx: Context,
    phrase: string | number
  ): Promise<number | null> => {
    const { minBet, maxBet, maxPocket, maxSafePocket } = bot.config.currency;
    const { GAMBLE_MESSAGES: MESSAGES } = Constants;
    const { pocket } = (await ctx.db.fetch()).data;

    let bet: string | number = phrase;

    if (!bet) {
      ctx.channel.send(MESSAGES.NEED_SOMETHING);
      return null;
    }

    if (!Boolean(Number(bet as number))) {
      bet = (bet as string).toLowerCase();

      if (bet === 'all') 
        bet = pocket;
      else if (bet === 'half') 
        bet = Math.round(pocket / 2);
      else if (bet === 'max')
        bet = pocket > (maxBet as number) ? (maxBet as number) : pocket;
      else if (bet === 'min') 
        bet = minBet as number;
      else if (bet.toLowerCase().endsWith('k'))
        bet = Number(bet.toLowerCase().replace('k', '000'));
      else {
        ctx.channel.send(MESSAGES.INVALID_AMOUNT);
        return null;
      }
    }

    if (pocket <= 0) {
      ctx.channel.send(MESSAGES.NO_COINS);
      return null;
    } else if (bet > maxBet) {
      ctx.channel.send(MESSAGES.BET_IS_HIGHER);
      return null;
    } else if (bet < minBet) {
      ctx.channel.send(MESSAGES.BET_IS_LOWER);
      return null;
    } else if (bet > pocket) {
      ctx.channel.send(MESSAGES.BET_HIGHER_THAN_POCKET.replace(/{pocket}/gi, pocket.toLocaleString()));
      return null;
    } else if (pocket > maxPocket) {
      ctx.channel.send(MESSAGES.POCKET_HIGHER_THAN_CAP);
      return null;
    } else if (bet < 1) {
      ctx.channel.send(MESSAGES.BET_IS_NAN);
      return null;
    }

    return Number(bet);
  },
});
