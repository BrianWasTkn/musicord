import { 
  Command, Argument,
  LavaClient, LavaCommand
} from 'discord-akairo'
import {
  Message, MessageEmbed
} from 'discord.js'

export default class Spawn extends Command implements LavaCommand {
  public client: LavaClient;
  public constructor() {
    super('lavas', {
      aliases: ['lavas', 'unpaids', 'lvs'],
      channel: 'guild',
      cooldown: 5e3,
      args: [{ id: 'member', type: 'member' }]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { channel, guild } = _;
    const user = args.member || _.member;
    const { paid, unpaid, eventsJoined } = await this.client.db.spawns.fetch({ userID: user.id });
    const embed: MessageEmbed = new MessageEmbed({
      title: `${user.user.username}'s lavas`,
      color: 'RANDOM',
      description: [
        `**Unpaid Coins:** ${unpaid.toLocaleString()}`,
        `**Events Joined:** ${eventsJoined.toLocaleString()}`
      ].join('\n'),
      footer: {
        text: 'lol imagine having coins fr'
      }
    });

    return channel.send({ embed });
  }
}