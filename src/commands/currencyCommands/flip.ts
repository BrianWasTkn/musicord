import { MessageOptions, Collection } from 'discord.js';
import { Argument } from 'discord-akairo';
import { Context } from 'lib/extensions';

import { Effects, Embed } from 'lib/utility';
import { Command, Item } from 'lib/objects';
import config from 'config/index';

export default class Currency extends Command {
  constructor() {
    super('flip', {
      aliases: ['flip', 'coinflip', 'cf'],
      channel: 'guild',
      description: 'Flip a coin to gamble!',
      category: 'Currency',
      cooldown: 1e4,
      args: [
        {
          id: 'amount',
          type: 'gambleAmount',
        },
      ],
    });
  }

  async exec(
    ctx: Context<{ amount: number }>
  ): Promise<string | MessageOptions> {
    const {
      util,
      util: { effects },
      db: { currency: DB },
    } = ctx.client;

    // Core
    const { maxWin, minBet, maxBet, maxPocket } = config.currency;
    const userEntry = await ctx.db.fetch();
    const data = userEntry.data;
    const multi = DB.utils.calcMulti(ctx, data).total;

    // Args
    const { amount: bet } = ctx.args;
    const args = ((bet: number) => {
      let state = false;
      switch (true) {
        case data.pocket <= 0:
          return { state, m: "You don't have coins to flip!" };
        case data.pocket >= maxPocket: 
          return { state, m: `You're too rich (${maxPocket.toLocaleString()}) to flip!` };
        case bet > data.pocket:
          return { state, m: `You only have **${data.pocket}** coins don't lie to me hoe.` };
        case !bet:
          return { state, m: 'You need something to flip!' };
        case bet < 1 || !Number.isInteger(Number(bet)):
          return { state, m: 'It has to be a real number greater than 0 yeah?' };
        case bet < minBet:
          return { state, m: `You can't flip lower than **${minBet}** coins sorry` };
        case bet > maxBet:
          return { state, m: `You can't flip higher than **${maxBet.toLocaleString()}** coins sorry` };
        default:
          return { state: true, m: null };
      }
    })(bet);
    if (!args.state) {
      return { content: args.m, replyTo: ctx.id };
    }

    // Item Effects
    let extraWngs: number = 0;
    for (const it of ['trophy']) {
      const userEf = effects.get(ctx.author.id);
      if (!userEf) {
        const col = new Collection<string, Effects>().set(it, new Effects());
        effects.set(ctx.author.id, col);
      }
      if (effects.get(ctx.author.id).has(it)) {
        extraWngs += effects.get(ctx.author.id).get(it).gambleWinnings;
      }
    }

    // Flip
    let cflip = util.randomNumber(1, 2);
    let heads = 1, tails = 2;

    // vis and db
    // let perwn: number, description: string[], identifier: string, color: string;
    const getAuthor = () => ({ name: `${ctx.author.username}'s coin game`, icon_url: ctx.author.avatarURL({ dynamic: true }) });
    ctx.send({ embed: {
      description: `**Call \`heads\` or \`tails\` in 30 seconds.**\n\nYour bet is **${bet.toLocaleString()}** coins.`,
      author: getAuthor(), color: 2533018, 
    }})
    const choice = (await ctx.awaitMessage()).first();
    if (!choice || !choice.content) {
    	await userEntry.addCd().removePocket(bet).updateItems().updateStats('won', bet).updateStats('wins').save();
    	return { content: `I flipped the coin, but you didn't call it in time! You lost your entire bet.` };
    }
    if (choice.content.toLowerCase().includes('heads')) {
    	if (cflip === heads) {
    		await userEntry.addCd().addPocket(bet).updateItems().calcSpace().updateStats('won', bet).updateStats('wins').save();
        ctx.client.handlers.quest.emit('gambleWin', { cmd: this, ctx });
        return { embed: {
          description: `**You won! It was heads!**\nYou won **${bet.toLocaleString()}**\n\nYou now have **${(data.pocket + bet).toLocaleString()}**`,
          author: getAuthor(), color: 'GREEN',
        }};
    	}

    	await userEntry.addCd().removePocket(bet).updateItems().updateStats('won', bet).updateStats('wins').save();
      ctx.client.handlers.quest.emit('gambleLost', { cmd: this, ctx });
      return { embed: {
        description: `**You lost! It was tails!**\nYou lost **${bet.toLocaleString()}**\n\nYou now have **${(data.pocket + bet).toLocaleString()}**`,
        author: getAuthor(), color: 'RED',
      }};
    }
    if (choice.content.toLowerCase().includes('tails')) {
    	if (cflip === tails) {
    		await userEntry.addCd().addPocket(bet).updateItems().calcSpace().updateStats('won', bet).updateStats('wins').save();
        ctx.client.handlers.quest.emit('gambleWin', { cmd: this, ctx });
        return { embed: {
          description: `**You won! It was tails!**\nYou won **${bet.toLocaleString()}**\n\nYou now have **${(data.pocket + bet).toLocaleString()}**`,
          author: getAuthor(), color: 'GREEN',
        }};
    	}

    	await userEntry.addCd().removePocket(bet).updateItems().updateStats('won', bet).updateStats('wins').save();
      ctx.client.handlers.quest.emit('gambleLose', { cmd: this, ctx });
      return { embed: {
        description: `**You lost! It was heads!**\nYou lost **${bet.toLocaleString()}**\n\nYou now have **${(data.pocket + bet).toLocaleString()}**`,
        author: getAuthor(), color: 'RED',
      }};
    }
  }
}
