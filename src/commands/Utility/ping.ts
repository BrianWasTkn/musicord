import { Message, MessageEmbed } from 'discord.js'
import { Command } from 'discord-akairo'

export default class Util extends Command {
  public client: Akairo.Client;
  public constructor() {
    super('ping', {
      aliases: ['ping', 'pong'],
      channel: 'guild',
      description: 'Checks the average latency across all shards',
      category: 'Utility'
    });
  }

  public async exec(_: Message): Promise<Message> {
    const { channel, client, guild } = _;
    const { id, ping } = guild.shard;
    const embed: MessageEmbed = new MessageEmbed({
      title: guild.name,
      color: 'RED',
      description: '**Status:** Poking...',
      timestamp: Date.now(),
      footer: {
          iconURL: client.user.avatarURL({ dynamic: true }),
          text: client.user.username
      }
    });

    const msg: Message = await channel.send({ embed });
    return msg.edit({ embed: new MessageEmbed({
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
    })})
  }
}