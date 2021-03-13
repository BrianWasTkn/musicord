import type { Message } from 'discord.js';
import type { Item } from '@lib/handlers/item';
import type { Lava } from '@lib/Lava';

export const argTypes = (bot: Lava) => ({
  shopItem: (msg: Message, phrase: string): Item | null => {
    const items = bot.handlers.item.modules;
    const item =
      items.get(phrase.toLowerCase()) ||
      items.find((i) => {
        return i.id.toLowerCase().includes(phrase.toLowerCase());
      });

    return item.id ? item : null;
  },

  gambleAmount: async (
    msg: Message,
    phrase: string | number
  ): Promise<number | null> => {
    const { minBet, maxBet, maxPocket } = bot.config.currency;
    const { pocket } = await bot.db.currency.fetch(msg.author.id);
    let bet: string | number = phrase;

    if (!bet) {
      msg.channel.send('You need something to gamble!');
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
        msg.channel.send('You actually need a number to bet...');
        return null;
      }
    }

    if (pocket <= 0) {
      msg.channel.send('You have no coins :skull:');
      return null;
    } else if (bet > maxBet) {
      msg.channel.send(`You can't gamble higher than **${maxBet.toLocaleString()}** coins >:(`);
      return null;
    } else if (bet < minBet) {
      msg.channel.send(`C'mon, you're not gambling lower than **${minBet.toLocaleString()}** yeah?`);
      return null;
    } else if (bet > pocket) {
      msg.channel.send(`You only have **${pocket.toLocaleString()}** lol don't try me`);
      return null;
    } else if (pocket > maxPocket) {
      msg.channel.send(`You're too rich to machine the slot`);
      return null;
    } else if (bet < 1) {
      msg.channel.send('It should be a positive number yeah?');
      return null;
    }

    return Number(bet);
  },
});
