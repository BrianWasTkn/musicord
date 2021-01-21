import Lava from 'discord-akairo'
import {
  Message, MessageEmbed
} from 'discord.js'

export default class Spawn extends Lava.Command {
  public client: Lava.Client;
  public constructor() {
    super('lavas', {
      aliases: ['lavas', 'unpaids', 'lvs'],
      channel: 'guild',
      description: 'Displays yours or someone else\'s lava unpaids',
      category: 'Spawn',
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