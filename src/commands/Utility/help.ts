import { EmbedField, MessageOptions } from 'discord.js';
import { Argument, Category } from 'discord-akairo';
import { MessagePlus } from '@lib/extensions/message';
import { EmbedFieldData } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

interface Help {
  query?: string | undefined;
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
          type: 'string',
          default: null,
        },
      ],
    });
  }

  private mapCommands(): EmbedField[] {
    const commands = this.handler.modules.array();
    const fields: EmbedField[] = [];

    for (const [category, catCmds] of this.handler.categories) {
      const cmds = [...catCmds.values()].map((c) => c.aliases[0]);
      fields.push({
        name: `${category} Commands • ${cmds.length}`,
        value: `\`${cmds.join('`, `')}\``,
        inline: false,
      });
    }

    return fields;
  }

  private fieldifyCmd(c: Command): EmbedFieldData[] {
    return new Embed()
      .addField(
        'Description',
        typeof c.description === 'string' ? c.description : 'No description.'
      )
      .addField('Triggers', `\`${c.aliases.join('`, `')}\``)
      .addField('Cooldown', c.cooldown / 1000, true)
      .addField('Category', c.category.id, true)
      .addField('CD Ratelimit', c.ratelimit || 1, true).fields;
  }

  public async exec(msg: MessagePlus, args: Help): Promise<MessageOptions> {
    const { handler } = this;
    const { query } = args;
    const embed = new Embed();

    let cat: Category<string, Command>;
    let cmd: Command;

    try {
      cat = this.handler.findCategory(query as string) as Category<string,Command>;
      cmd = this.handler.findCommand(query as string);
    } catch {}

    if (cmd && !cat) {
      embed
        .setFooter(false, msg.author.tag, msg.author.avatarURL({ dynamic: true }))
        .setTitle(
          `${
            (this.handler.prefix as (m: MessagePlus) => string | string[])(msg)[0]
          } ${cmd.id} info`
        )
        .addFields(this.fieldifyCmd(cmd))
        .setColor('ORANGE');
    } else if (cat) {
      const bot = this.client.user;
      embed
        .setDescription(
          `\`${cat
            .array()
            .map((c) => c.aliases[0])
            .join('`, `')}\``
        )
        .setTitle(`${cat.array()[0].categoryID} Commands`)
        .setFooter(false, bot.username, bot.avatarURL())
        .setColor('ORANGE');
    } else {
      embed
        .setDescription("Lava.")
        .setFooter(false, `${this.handler.modules.size} total commands`)
        .setTitle(`${this.client.user.username} Commands`)
        .setThumbnail(this.client.user.avatarURL())
        .addFields(this.mapCommands())
        .setColor('ORANGE');
    }

    return { embed };
  }
}
