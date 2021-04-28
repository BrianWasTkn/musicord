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
      ownerOnly: true,
      cooldown: 6e4,
    });
  }

  async exec( ctx: Context ): Promise<MessageOptions> {
    const reqs = { xp: 1000, coins: 1e6 };
    const calcCoins = (m: number) => m / reqs.coins;
    const calcXP = (m: number) => m / reqs.xp;

    const { data } = await ctx.db.fetch();
    const { xp } = data.stats;

    return { replyTo: ctx.id, embed: {
      color: 'ORANGE', description: `You'll craft **:coin: ${data.pocket.toLocaleString()}** coins for **:key: ${calcCoins(data.pocket)}** keys.`
    }};
  }
}
