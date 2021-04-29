import { Context, MemberPlus, UserPlus } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/handlers/command';
import { Embed } from 'lib/utility/embed';

export default class Spawn extends Command {
  constructor() {
    super('paid', {
      aliases: ['paid'],
      description: 'Updates someone elses or your lava unpaid amounts',
      category: 'Spawn',
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'amount',
          type: 'number',
          unordered: true,
        },
        {
          id: 'member',
          type: 'member',
          unordered: true,
          default: (message: Context) => message.member,
        },
      ],
    });
  }

  async exec(
    ctx: Context<{
      member: MemberPlus;
      amount: number;
    }>
  ): Promise<string | MessageOptions> {
    const { fetch, remove } = this.client.db.spawns;
    const { amount, member } = ctx.args;
    const { user } = member;
    if (!amount) return 'You need an amount';
    if (!member) return 'You need a user';
    const bot = this.client.user;
    const old = await fetch(user.id);
    const d = await remove(user.id, 'unpaid', amount);

    if (d.allowDM) {
      await user.send({ embed: {
        author: { name: `${ctx.author.tag} — ${ctx.author.id}`, iconURL: ctx.author.avatarURL({ dynamic: true }) },
        title: `Paid Unpaids`, color: 'GREEN', footer: { text: ctx.guild.name, iconURL: ctx.guild.iconURL() },
        fields: [ 
          { name: '• Old Value', value: old.unpaid.toLocaleString() }, 
          { name: '• New Value', value: d.unpaid.toLocaleString() }, 
        ]
      }});
    }

    const embed = new Embed()
      .addField('• Old Value', old.unpaid.toLocaleString())
      .addField('• New Value', d.unpaid.toLocaleString())
      .setTitle(':white_check_mark: Unpaids Updated.')
      .setFooter(true, bot.username, bot.avatarURL())
      .setColor('GREEN');

    return { embed };
  }
}
