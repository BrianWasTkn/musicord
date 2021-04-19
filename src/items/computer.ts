import { Context } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('computer', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':desktop:',
      name: "Prob's Computer",
      cost: 69420,
      info: {
        short: 'Post memes on reddit!',
        long: 'Coins you gain reaches up to a million but it depends to your karma but your computer\'ll most likely break if you get negative karmas.',
      }
    });
  }

  async use(ctx: Context): Promise<string> {
    const { util } = this.client;
    const { data } = await ctx.db.fetch();
    const comp = data.items.find((i) => i.id === this.id);

    const things = {
      f: 'Funny',
      u: 'Unoriginal',
      c: 'Coyrighted',
      k: 'Karen'
    };

    const [t, type] = [Object.keys(things), Object.values(things)];
    ctx.channel.send(`**__${ctx.author.toString()} So what type of meme?__**\n${
      Array(t.length).fill(null).map((_, i) => {
        return `**\`${t[i]}\` ■ ${type[i]} Meme**`;
      }).join('\n')
    }`);

    const f = (m: Context) => m.author.id === ctx.author.id;
    const rep = (await ctx.channel.awaitMessages(f, { max: 1, time: 15000 })).first();
    if (!rep) {
      return 'Imagine wasting 15 seconds of my bottime :rolling_eyes:';
    }
    if (!things[rep.content.toLowerCase()]) {
      return 'Stop giving me invalid options buddy >:(';
    }

    const karma = util.randomNumber(1, 1e4);

    if (Math.random() < 0.2) {
      comp.amount--;
      await data.save();
      return `Your meme got **-${karma.toLocaleString()}** karmas so you broke your **${this.emoji} ${this.name}** lmao sucks to be you.`;
    }

    const gain = util.randomNumber(100, 1e5);
    await ctx.db.addPocket(gain).save();

    return `You got **__${gain.toLocaleString()} coins__** (${karma} karmas) from posting a ${things[rep.content.toLowerCase()].toLowerCase()} meme on reddit.`;
  }
}
