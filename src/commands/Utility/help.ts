import { Message, MessageEmbed, EmbedField } from 'discord.js';
import { Argument, Command } from 'discord-akairo';
import { EmbedFieldData } from 'discord.js';
import { Lava } from '@lib/Lava';

interface Help {
  query?: string | undefined;
}

export default class Utility extends Command {
  client: Lava;

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
    const categories = [...new Set(commands.map((c) => c.categoryID))];
    const fields: EmbedField[] = [];

    for (const category of categories) {
      const catCommands = this.handler
        .findCategory(category)
        .map((cmd) => cmd.aliases[0]);

      fields.push({
        name: `${category} Commands • ${catCommands.length}`,
        inline: false,
        value: `\`${catCommands.join('`, `')}\``,
      });
    }

    return fields;
  }

  private fieldifyCmd(
    c: Command & {
      examples?: string[]; // todo: add types for custom command class
    }
  ): EmbedFieldData[] {
    return (
      new MessageEmbed()
        .addField('Description', c.description || 'No description.')
        // .addField('Examples', c.examples.map(e => `- ${e}`).join('\n'))
        .addField('Triggers', `\`${c.aliases.join('`, `')}\``)
        .addField('Cooldown', c.cooldown / 1000, true)
        .addField('Category', c.category.id, true)
        .addField('CD Ratelimit', c.ratelimit || 1, true).fields
    );
  }

  public async exec(_: Message, args: Help): Promise<Message> {
    const cat = this.handler.findCategory(args.query || '');
    const cmd = this.handler.findCommand(args.query || '');
    const embed = new MessageEmbed();

    if (cmd && !cat) {
      const fields = this.fieldifyCmd(cmd);
      embed
        .setTitle(`${this.handler.prefix[0]} ${cmd.aliases[0]} info`)
        .setFooter(
          `Requested by: ${_.author.tag}`,
          _.author.avatarURL({ dynamic: true })
        )
        .addFields(fields)
        .setColor('ORANGE');
      return _.channel.send({ embed });
    } else if (cat) {
      embed
        .setTitle(`${cat.array()[0].categoryID} Commands`)
        .setDescription(
          `\`${cat
            .array()
            .map((c) => c.aliases[0])
            .join('`, `')}\``
        )
        .setColor('ORANGE')
        .setFooter(this.client.user.username, this.client.user.avatarURL());
    } else {
      const fields = this.mapCommands();
      embed
        .setDescription(
          'Lava is the best bot so sub to me with twitch prime when?'
        )
        .setTitle(`${this.client.user.username} Commands`)
        .setThumbnail(this.client.user.avatarURL())
        .setFooter(`${this.handler.modules.size} total commands`)
        .addFields(fields)
        .setColor('ORANGE');
    }

    return _.channel.send({ embed });
  }
}
