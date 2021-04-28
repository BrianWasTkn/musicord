import { GuildMember, MessageOptions } from 'discord.js';
import { InventorySlot } from 'lib/interface/handlers/item';
import { Context } from 'lib/extensions/message';
import { UserPlus } from 'lib/extensions/user';
import { MemberPlus } from 'lib/extensions/member';
import { Command } from 'lib/handlers/command';
import { Item } from 'lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('craft', {
      aliases: ['craft', 'transform'],
      channel: 'guild',
      description: "Craft your coins into keys!",
      category: 'Currency',
      cooldown: 6e4,
    });
  }

  async exec( ctx: Context ): Promise<MessageOptions> {
    const reqs = { xp: 1000, coins: 100e6 };
    const calcCoins = (m: number) => m / reqs.coins;
    const calcXP = (m: number) => m / reqs.xp;
    const userEntry = await ctx.db.fetch();
    const { data } = userEntry;
    const { xp } = data.stats;

    if (data.pocket < reqs.coins) {
      return { replyTo: ctx.id, content: `You don't have enough coins to craft!` };
    }

    await ctx.channel.send(`You can craft **:key: ${Math.round(calcCoins(data.pocket)).toLocaleString()}** keys to craft from **:coin: ${data.pocket.toLocaleString()}** coins, how many keys do you wanna craft right now?`, { replyTo: ctx.id });
    const choice = (await ctx.awaitMessage()).first();
    if (!choice) {
      return { replyTo: ctx.id, content: 'Imagine wasting my time.' };
    }
    if (!Number.isInteger(Number(choice.content)) || Number(choice.content) <= 0) {
      return { replyTo: ctx.id, content: 'It has to be a real number greater than 0 yeah?' };
    }
    
    const nice = Number(choice.content);
    if (nice > Math.round((data.pocket * reqs.coins) / nice) ) {
      return { replyTo: ctx.id, content: `You can't craft keys more than what you actually can, buddy` };
    }

    await userEntry.addPremiumKeys(Math.round(nice)).removePocket(Math.round(nice * reqs.coins)).save();
    return { replyTo: ctx.id, embed: { color: 'GOLD', description: `Successfully crafted **:coin: ${Math.round(nice * reqs.coins).toLocaleString()}** coins into **:key: ${Math.round(nice).toLocaleString()}** keys.` }};
  }
}
