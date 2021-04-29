import { EmbedField, MessageOptions, Collection, PermissionString } from 'discord.js';
import { Argument, Category } from 'discord-akairo';
import { Context } from 'lib/extensions/message';
import { EmbedFieldData } from 'discord.js';
import { Command } from 'lib/handlers/command';
import { Embed } from 'lib/utility/embed';
import botPackage from 'src/../package.json';

type CategoryShort = Category<string, Collection<string, Command>>
interface Help {
  query: Command | CategoryShort;
}

export default class Utility extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'h'],
      channel: 'guild',
      description: 'Fetches all public commands of this bot.',
      category: 'Utility',
      args: [
        {
          id: 'query',
          default: null,
          type: Argument.union('command', 'commandAlias', (m: Context, phrase) => {
            return this.handler.findCategory(phrase) || null;
          }),
        },
      ],
    });
  }

  private mapCommands(isOwner = false): EmbedField[] {
    const entries: { [cat: string]: Command[] } = {};

    for (const [category, catCmds] of this.handler.categories) {
      const cmds = [...catCmds.values()];
      entries[category] = cmds.filter(c => !isOwner ? !c.ownerOnly : true);
      if (entries[category].length <= 0) delete entries[category];
    }

    return Object.entries(entries).map(([cat, cmds]) => ({
      name: `${cat} Commands • ${cmds.length}`,
      value: `\`${cmds.join('`, `')}\``,
      inline: false,
    }));
  }

  public async exec(ctx: Context<Help>): Promise<MessageOptions> {
    const { parseTime } = ctx.client.util;
    const { query } = ctx.args;

    // Command Search
    if (query instanceof Command) {
      const cmd = query as Command;
      const fields = Object.entries({
        'Triggers': `\`${cmd.aliases.join('`, `')}\``,
        'Cooldown': `**${parseTime((cmd.cooldown || 1e3) / 1e3)}**`,
        'Category': cmd.category.id,
        'Bot Perms': `\`${['SEND_MESSAGES'].concat((cmd.clientPermissions as string[]) || []).join('`, `')}\``,
      }).map(([name, value]) => ({ inline: true, name, value }));

      return { embed: {
        title: `${this.handler.prefix[0]} ${cmd.aliases[0]} info`,
        description: cmd.description || 'No description provided.',
        color: 'ORANGE', fields,
      }};
    }

    // Category Search
    if (query instanceof Category) {
      const isOwner = this.client.isOwner(ctx.author.id);
      const category = this.handler.categories.get(query.id);
      const commands = [...category.values()].filter(c => {
        return isOwner ? true : !c.ownerOnly;
      });

      if (commands.length <= 0) {
        return { replyTo: ctx.id, content: "Wew, all commands under that category are for my owners only." };
      }

      return { embed: {
        description: `\`${commands.map(c => c.aliases[0]).join('`, `')}\``,
        title: `${category.id} Commands`, color: 'ORANGE', footer: {
          icon_url: ctx.client.user.avatarURL(),
          text: `${commands.length} Commands`, 
        }
      }};
    }

    // Neither
    return { embed: {
      footer: { text: `${this.handler.modules.size} Commands  |  Version: ${botPackage.version}`, iconURL: ctx.client.user.avatarURL() },
      title: `${ctx.client.user.username} Commands`, color: 'ORANGE', fields: this.mapCommands(ctx.client.isOwner(ctx.author.id)),
      thumbnail: { url: ctx.client.user.avatarURL() }, description: botPackage.description,
    }};
  }
}
