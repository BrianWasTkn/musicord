import { GuildMember, MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { UserPlus } from 'lib/extensions/user';
import { MemberPlus } from 'lib/extensions/member';
import { Command } from 'lib/handlers/command';
import { Item } from 'lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('cooldowns', {
      aliases: ['cooldowns', 'cds'],
      channel: 'guild',
      description: "Check your cooldowns.",
      category: 'Currency',
      args: [
        {
          id: 'member',
          type: 'member',
          default: (m: Context) => m.member,
        },
      ],
    });
  }

  async exec(ctx: Context<{ member: MemberPlus }>): Promise<MessageOptions> {
    const userEntry = await ctx.db.fetch(ctx.args.member.user.id, ctx.args.member.user.id === ctx.author.id),
    { cooldowns } = userEntry.data;

    function calc(time: number) {
    	const methods = [2592000, 86400, 3600, 60, 1];
    	const ret = [ Math.floor(time / methods[0]) ];

    	for (let i = 0; i < methods.length - 1; i++) {
  			const raw = (time % methods[i]) / methods[i + 1];
  			const calced = Math.floor(raw);
  			ret.push(Math.floor(raw));
  		}

  		return ret.map(r => r < 10 ? `0${r}` : r.toString());
    }

    function display(c: CooldownData) {
    	return `${c.id}: ${calc((c.expire - Date.now()) / 1e3).join(':')}`
    }

    return { embed: {
    	color: 'ORANGE', description: cooldowns.filter(c => c.expire > Date.now()).map(display).join('\n') || 'No active cooldowns.',
    	author: { name: `${ctx.author.username}'s cooldowns` },
    }}
  }
}
