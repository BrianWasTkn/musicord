import { Message, MessageEmbed } from 'discord.js'
import { LavaClient, LavaCommand, Command } from 'discord-akairo'

export default class Currency extends Command implements LavaCommand {
  public client: LavaClient;
  public constructor() {
    super('bal', {
      aliases: ['balance', 'bal'],
      channel: 'guild',
      cooldown: 1e3,
      args: [{ 
        id: 'member', type: 'member' 
      }]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const user = args.member || _.member;
    const data = await this.client.db.currency.fetch(user.user.id);
    const embed: MessageEmbed = new MessageEmbed({
      title: `${user.user.username}'s balance`,
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