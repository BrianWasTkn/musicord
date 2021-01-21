import { Message, MessageEmbed } from 'discord.js'
import Lava from 'discord-akairo'

export default class Currency extends Lava.Command {
  public client: Lava.Client;
  public constructor() {
    super('bal', {
      aliases: ['balance', 'bal'],
      channel: 'guild',
      cooldown: 1e3,
      args: [{ 
        id: 'member', 
        type: 'member',
        default: (message: Message) => message.member 
      }]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { user } = args.member || _.member;
    const data = await this.client.db.currency.fetch(user.id);
    const embed: MessageEmbed = new MessageEmbed({
      title: `${user.username}'s balance`,
      color: 'RANDOM',
      description: [
        `**Pocket:** ${data.pocket.toLocaleString()}`,
        `**Vault:** ${data.vault.toLocaleString()}/${data.space.toLocaleString()}`,
        `**Total:** ${(data.pocket + data.vault).toLocaleString()}`
      ].join('\n')
    });

    return _.channel.send({ embed });
  }
}