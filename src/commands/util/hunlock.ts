import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import {
  PermissionOverwriteOption,
  MessageOptions,
  GuildChannel,
  TextChannel,
  Role,
} from 'discord.js';

type ContextPlus = Context<{
  interval: number;
  role: Role;
}>;

export default class Util extends Command {
  constructor() {
    super('hunlock', {
      aliases: ['hunlock', 'hul'],
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_CHANNELS'],
      description: 'Unlocks the heist channel if you have right permissions',
      category: 'Utility',
      args: [
        {
          id: 'role',
          type: 'role',
          default: (m: Context) => m.guild.roles.cache.get(m.guild.id),
        },
        {
          id: 'interval',
          type: 'number',
          default: 10,
        },
      ],
    });
  }

  private embed(display: number, role: Role, color?: string): MessageOptions['embed'] {
    return {
      color: color || 'ORANGE', title: `Unlocking In...`,
      description: `**${display}** seconds.`, footer: {
        text: `Requirement: ${role.name}`,
        iconURL: role.guild.iconURL({ dynamic: true }),
      },
    };
  }

  async exec(ctx: ContextPlus): Promise<MessageOptions> {
    const { sleep, parseTime, heists } = this.client.util;
    const { role, interval } = ctx.args;
    const embed = (num: number, color: string) => this.embed(num, role, color);
    let num = 60, msg = await ctx.send({ embed: embed(num, 'ORANGE') });
    await ctx.delete().catch(() => {});

    const run = async (int: number) => {
      if (num === 10) {
        await sleep(7e3);
        await msg.edit({ embed: embed(3, 'RED') });
        await sleep(1e3);
        await msg.edit({ embed: embed(2, 'RED') });
        await sleep(1e3);
        await msg.edit({ embed: embed(1, 'RED') });
        await sleep(1e3);
        await msg.edit({ embed: embed(0, 'RED') });
        return num;
      }

      await sleep(int * 1e3);
      num -= 10; msg = (await msg.edit({ 
        embed: embed(num, 'ORANGE')
      })) as ContextPlus;
      return await run(int);
    };

    await run(interval);
    const reason = `Heist Unlock — ${msg.author.tag}`;
    const perms: PermissionOverwriteOption = { SEND_MESSAGES: true };
    (msg.channel as TextChannel).updateOverwrite(role.id, perms, reason);
    heists.set(msg.channel.id, role);

    return { replyTo: ctx.id, embed: {
      description: `**Unlocked for ${role.toString()} role.**`,
      title: `Channel Unlocked`, color: 'GREEN', footer: {
        text: ctx.guild.name,
        iconURL: ctx.guild.iconURL({ dynamic: true }),
      },
    }};
  }
}
