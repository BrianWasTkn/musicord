import type { MessagePlus } from '@lib/extensions/message';
import type { Quest } from '@lib/handlers/quest';
import type { Item } from '@lib/handlers/item';
import type { Lava } from '@lib/Lava';
import Constants from './constants'

export const argTypes = (bot: Lava) => ({
  shopItem: (msg: MessagePlus, phrase: string): Item | null => {
    if (!phrase) return null;
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

  questQuery: (msg: MessagePlus, phrase: string): Quest | null => {
    if (!phrase) return null;
    const items = [...bot.handlers.quest.modules.values()];
    return items.find((i) => {
      return (
        i.id.toLowerCase() === phrase.toLowerCase() ||
        i.name.toLowerCase() === phrase.toLowerCase() ||
        i.name.toLowerCase().includes(phrase.toLowerCase()) ||
        i.id.toLowerCase().includes(phrase.toLowerCase())
      );
    });
  },

  gambleAmount: async (
    msg: MessagePlus,
    phrase: string | number
  ): Promise<number | null> => {
    const { minBet, maxBet, maxPocket, maxSafePocket } = bot.config.currency;
    const { GAMBLE_MESSAGES: MESSAGES } = Constants;
    const { pocket } = await msg.author.fetchDB();

    let bet: string | number = phrase;

    if (!bet) {
      msg.channel.send(MESSAGES.NEED_SOMETHING);
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
        msg.channel.send(MESSAGES.INVALID_AMOUNT);
        return null;
      }
    }

    if (pocket <= 0) {
      msg.channel.send(MESSAGES.NO_COINS);
      return null;
    } else if (bet > maxBet) {
      msg.channel.send(MESSAGES.BET_IS_HIGHER);
      return null;
    } else if (bet < minBet) {
      msg.channel.send(MESSAGES.BET_IS_LOWER);
      return null;
    } else if (bet > pocket) {
      msg.channel.send(MESSAGES.BET_HIGHER_THAN_POCKET.replace(/{pocket}/gi, pocket.toLocaleString()));
      return null;
    } else if (pocket > maxPocket) {
      msg.channel.send(MESSAGES.POCKET_HIGHER_THAN_CAP);
      return null;
    } else if (bet < 1) {
      msg.channel.send(MESSAGES.BET_IS_NAN);
      return null;
    }

    return Number(bet);
  },
});
