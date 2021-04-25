import { EmbedField, MessageOptions, Collection } from 'discord.js';
import { Argument, Category } from 'discord-akairo';
import { Context } from 'lib/extensions/message';
import { EmbedFieldData } from 'discord.js';
import { Command } from 'lib/handlers/command';
import { Embed } from 'lib/utility/embed';

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
    const fields: EmbedField[] = [];

    for (const [category, catCmds] of this.handler.categories) {
      const cmds = [...catCmds.values()].filter(cmd => {
        return isOwner ? !cmd.ownerOnly : true;
      }).map((c) => c.aliases[0]).sort();
      
      fields.push({
        name: `${category} Commands • ${cmds.length}`,
        value: `\`${cmds.join('`, `')}\``,
        inline: false,
      });
    }

    return fields;
  }

  public async exec(ctx: Context<Help>): Promise<MessageOptions> {
    const { parseTime } = ctx.client.util;
    const { query } = ctx.args;

    // Command Search
    if (query instanceof Command) {
      const cmd = query as Command;
      const fields = Object.entries({
        'Triggers': `\`${cmd.aliases.join('`, `')}\``,
        'Cooldown': parseTime((cmd.cooldown || 1e3) / 1e3),
        'Category': cmd.category.id,
        'Permissions': ['SEND_MESSAGES'].concat((cmd.userPermissions as string[]) || []),
      }).map(([name, value]) => ({ inline: true, name, value }));

      return { embed: {
        title: `${this.handler.prefix[0]} ${cmd.aliases[0]} info`,
        description: cmd.description || 'No description provided.',
        color: 'ORANGE', fields,
      }};
    }

    // Category Search
    if (((query as unknown) as Command).category instanceof Category) {
      const command = (query as unknown) as Command;
      const category = this.handler.categories.get(command.categoryID);
      const commands = [...category.values()];
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
      title: `${ctx.client.user.username} Commands`, color: 'ORANGE',
      fields: this.mapCommands(ctx.client.isOwner(ctx.author.id)),
      footer: { text: `${this.handler.modules.size} Commands` },
      thumbnail: { url: ctx.client.user.avatarURL() }
    }};
  }
}
