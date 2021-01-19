import { 
  Command, Argument,
  LavaClient
} from 'discord-akairo'
import {
  Message, MessageEmbed
} from 'discord.js'

export default class Spawn extends Command {
  public client: LavaClient;
  public constructor() {
    super('lavas', {
      aliases: ['lavas', 'unpaids', 'lvs'],
      channel: 'guild',
      cooldown: 5e3,
      args: [{ 
        id: 'member', type: 'member',
        default: (message: Message) => message.member
      }]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const user = args.member;
    const data = await this.client.db.spawns.fetch(user.id);
    const embed: MessageEmbed = new MessageEmbed({
      title: `${user.user.username}'s lavas`,
      color: 'RANDOM',
      description: [
        `**Unpaid Coins:** ${data.unpaid.toLocaleString()}`,
        `**Events Joined:** ${data.eventsJoined.toLocaleString()}`
      ].join('\n'),
      footer: {
        text: 'Show these in our payouts channel.'
      }
    });

    return _.channel.send({ embed });
  }
}