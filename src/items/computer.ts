import { Context } from 'lib/extensions/message';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('computer', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: false,
      emoji: ':desktop:',
      name: "Prob's Computer",
      cost: 69420,
      info: {
        short: 'Post memes on reddit!',
        long:
          "Coins you gain depends to your karma but your computer will most likely break if you get negative karmas.",
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
    const { util } = this.client;
    const entry = ctx.db;
    const data = entry.data;

    const things = {
      f: 'Funny',
      u: 'Unoriginal',
      c: 'Coyrighted',
      k: 'Karen',
    };

    const [t, type] = [Object.keys(things), Object.values(things)];
    ctx.channel.send(
      `**__${ctx.author.toString()} So what type of meme?__**\n${Array(t.length)
        .fill(null)
        .map((_, i) => {
          return `**\`${t[i]}\` ■ ${type[i]} Meme**`;
        })
        .join('\n')}`
    );

    const f = (m: Context) => m.author.id === ctx.author.id;
    const rep = (await ctx.awaitMessage(ctx.author.id, 15e3)).first();
    if (!rep) {
      return { content: 'Imagine wasting 15 seconds of my bottime :rolling_eyes:' };
    }
    if (!things[rep.content.toLowerCase()]) {
      return { content: 'Stop giving me invalid options buddy >:(' };
    }

    const karma = util.randomNumber(1, 1e4);
    if (Math.random() < 0.2) {
      await entry.removeInv(this.id).updateItems().save();
      return { content: `Your meme got **-${
        karma.toLocaleString()
      }** karmas and you broke your **${
        this.emoji
      } ${this.name}** lmao sucks to be you.` };
    }

    const gain = util.randomNumber(100, 1e4);
    await entry.addPocket(gain).updateItems().save();

    return { content: `You got **__${gain.toLocaleString()} coins__** (${karma} karmas) from posting a ${things[
      rep.content.toLowerCase()
    ].toLowerCase()} meme on reddit.` };
  }
}
