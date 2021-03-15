import { Message, GuildMember, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('balance', {
      aliases: ['balance', 'bal'],
      channel: 'guild',
      description: "Check yours or someone else's lava balance.",
      category: 'Currency',
      cooldown: 1e3,
      args: [
        {
          id: 'member',
          type: 'member',
          default: (message: Message) => {
            return message.member;
          },
        },
      ],
    });
  }

  public async exec(
    _: Message,
    {
      member,
    }: {
      member: GuildMember;
    }
  ): Promise<MessageOptions> {
    const { fetch } = this.client.db.currency;
    const { pocket, vault, space, items } = await fetch(member.user.id);
    const handler = this.client.handlers.item;
    const net = items
      .map(i => {
        const it = handler.modules.get(i.id);
        return it.cost * i.amount;
      })
      .reduce((a, b) => {
        return a + b;
      });

    const dpn: string[] = [];

    [
      `**Pocket:** ${pocket.toLocaleString()}`,
      `**Vault:** ${vault.toLocaleString()}/${space.toLocaleString()}`,
      `**Total:** ${(pocket + vault).toLocaleString()}`,
      `**Net:** ${(pocket + vault + net).toLocaleString()}`
    ].forEach((i) => dpn.push(i));

    const embed: Embed = new Embed()
      .setTitle(`${member.user.username}'s balance`)
      .setDescription(dpn.join('\n'))
      .setFooter(false, 'discord.gg/memer')
      .setColor('RANDOM');

    return { embed };
  }
}
