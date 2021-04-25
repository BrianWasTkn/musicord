import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import {
  PermissionOverwriteOption,
  MessageOptions,
  TextChannel,
  Role,
} from 'discord.js';

export default class Util extends Command {
  constructor() {
    super('hlock', {
      aliases: ['hlock', 'hl'],
      channel: 'guild',
      description: 'Locks the heist channel if you have proper permissions.',
      category: 'Utility',
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_CHANNELS'],
    });
  }

  async exec(ctx: Context): Promise<MessageOptions> {
    ctx.delete().catch(() => {});
    const role = this.client.util.heists.get(ctx.channel.id);
    if (!role) return;

    const reason = `Heist Lock — ${ctx.author.tag}`;
    const owrite: PermissionOverwriteOption = { SEND_MESSAGES: null };
    await (ctx.channel as TextChannel).updateOverwrite(role.id, owrite, reason);

    return { replyTo: ctx.id,  embed: {
      description: `**Locked for ${role.toString()} role.**`,
      title: `Channel Locked`, color: 'RED', footer: {
        iconURL: ctx.guild.iconURL({ dynamic: true }),
        text: ctx.guild.name,
      },
    }};
  }
}
