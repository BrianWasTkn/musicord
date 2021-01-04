import { Message, MessageEmbed } from 'discord.js'
import { LavaCommand, LavaClient, Command } from 'discord-akairo'

export default class Util extends Command implements LavaCommand {
  public client: LavaClient;
  public constructor() {
    super('ping', {
      aliases: ['ping', 'pong'],
      channel: 'guild'
    });
  }

  public async exec(_: Message): Promise<Message> {
    const { channel, client, guild } = _;
    const { id, ping } = guild.shard;
    const embed = new MessageEmbed({
      title: guild.name,
      color: 'ORANGE',
      description: [
        `**Shard ID:** ${id}`,
        `**Latency:** \`${ping}ms\``,
        `**Websocket:** \`${client.ws.ping}ms\``
      ].join('\n'),
      timestamp: Date.now(),
      footer: {
          iconURL: client.user.avatarURL({ dynamic: true }),
          text: client.user.username
      }
    });

    return channel.send(embed);
  }
}