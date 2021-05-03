import { CollectorFilter, Collection, TextChannel } from 'discord.js';
import { Listener } from 'lib/objects';
import { Context } from 'lib/extensions';
import { Lava } from 'lib/Lava';

const qObj = {
  giveaway: {
    Giveaway: 'What do you wanna giveaway?',
    Winners: 'Please specify a number of winners',
    Duration: 'What is the duration for this giveaway?',
    Requirement:
      'What should be the requirement for this giveaway? Type none if none.',
    Message: 'Any extra message for your giveaway?',
  },
  event: {
    'Event Type':
      'What type of event do you wanna sponsor?\nlast to leave, fish/hunt event, race event, or other assorted events.',
    Winners:
      "If your type of event requires a giveaway bot, please tell us the number of winners. Type none if there isn't.",
    Donation:
      'What do you want the winners to receive? Any items or coin amount.',
  },
  heist: {
    Amount: 'How much coins you wanna sponsor?',
    Requirement: 'What should be the requiement? Type none if none.',
  },
};

const roles = {
  giveaway: '692892567787929691',
  heist: '697007407011725312',
  event: '697007407011725312',
};

async function handleDonation(
  ctx: Context,
  type: 'giveaway' | 'event' | 'heist'
) {
  try {
    await ctx.delete();
    const dm = await ctx.author.createDM();
    const res = new Collection<string, string>();
    try {
      const questions = qObj[type];
      await dm.send(
        `**Welcome to our interactive ${type} donation menu**\n*I will ask you series of questions for your ${type} donation. You have **60 seconds** for each question. You can type \`cancel\` anytime. Type anything to continue.*`
      );
      const filter: CollectorFilter<Context[]> = (m) =>
        m.author.id === ctx.author.id;
      const fcol = (
        await dm.awaitMessages(filter, { max: 1, time: 60000 })
      ).first();
      if (!fcol || fcol.content.toLowerCase() === 'cancel') {
        return await dm.send('The donation has been cancelled.');
      }

      let qArr: string[] = Object.keys(questions);
      let index: number = 0;
      async function collect(question: string) {
        await dm.send(question);
        const m = (
          await dm.awaitMessages(filter, { max: 1, time: 60000 })
        ).first();
        if (!m || m.content.toLowerCase() === 'cancel') return false;
        res.set(qArr[index], m.content);
        index++;
        const q = questions[qArr[index]];
        return !q ? true : await collect(q);
      }

      const col = await collect(questions[qArr[index]]);
      if (!col) return await dm.send('Your dono has been cancelled.');
      let results: string[] = [];
      for (const [label, response] of res) {
        results.push(`**${label}:** ${response}`);
      }

      const chan = ctx.guild.channels.cache.get(
        '691596367776186379'
      ) as TextChannel;
      const role = ctx.guild.roles.cache.get(roles[type]);
      const r = results.join('\n');
      await chan.send({
        content: `${role.toString()} ${ctx.author.toString()}`,
        allowedMentions: { roles: [role.id], users: [ctx.author.id] },
        embed: {
          description: r,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Donation`,
          color: 'RANDOM',
          footer: {
            text: `${ctx.author.tag} (${ctx.author.id})`,
            icon_url: ctx.author.avatarURL({ dynamic: true }),
          },
        },
      });

      const accChan = ctx.guild.channels.cache.get('691596367776186379');
      await ctx.member.roles.add('715507078860505091');
      return await dm.send(
        `Thanks for your donation! You now have access to ${accChan.toString()} to give your donation to our staffs.`
      );
    } catch {
      return await dm.send('Something wrong occured :c');
    }
  } catch {
    const m = await ctx.send({
      content: `${ctx.author.toString()} please open your DMs.`,
    });
    await new Promise((res) => setTimeout(res, 1e4));
    return await m.delete();
  }
}

export default class ClientListener extends Listener<Lava> {
  constructor() {
    super('donation', {
      emitter: 'client',
      event: 'message',
    });
  }

  public async exec(ctx: Context): Promise<void | Context> {
    if (ctx.channel.id !== '818667160918425630') return;

    const haha = { 1: 'giveaway', 2: 'heist', 3: 'event' };
    const query = haha[Number(ctx.content)];
    if (ctx.author.bot) return;
    if (!query) return ctx.delete() as Promise<Context>;

    return (await handleDonation(ctx, query)) as Context;
  }
}
