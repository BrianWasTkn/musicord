import { Message, MessageEmbed } from 'discord.js'
import { LavaClient, LavaCommand, Command } from 'discord-akairo'

export default class Currency extends Command implements LavaCommand {
  public client: LavaClient;
  public constructor() {
    super('bal', {
      aliases: ['balance', 'bal'],
      channel: 'guild',
      cooldown: 1e3,
      args: [{ id: 'member', type: 'member' }]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { channel, guild } = _;
    const user = args.member || _.member;
    const { pocket, vault, space } = await this.client.db.currency.fetch({ userID: user.id });
    const embed: MessageEmbed = new MessageEmbed({
      title: `${user.user.username}'s balance`,
      color: 'RANDOM',
      description: [
        `**Pocket:** ${pocket.toLocaleString()}`,
        `**Vault:** ${vault.toLocaleString()}/${space.toLocaleString()}`,
        `**Total:** ${(pocket + vault).toLocaleString()}`
      ].join('\n'),
      footer: {
        text: 'lol imagine having coins fr'
      }
    });

    return channel.send({ embed });
  }
}