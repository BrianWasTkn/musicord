import { Message, CollectorFilter, AwaitMessagesOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { inspect } from 'util';
import repl from 'programmatic-repl';

export default class Dev extends Command {
  constructor() {
    super('repl', {
      aliases: ['repl'],
      description: 'Start a REPL session',
      category: 'Dev',
      ownerOnly: true,
    });
  }

  private async _collect(_: Message): Promise<Message> {
    const filter: CollectorFilter = ({ author }: Message) =>
      author.id === _.author.id;
    const options: AwaitMessagesOptions = { max: 1, time: 600000 };

    const collected = await _.channel.awaitMessages(filter, options);
    return [...collected.values()][0];
  }

  async exec(_: Message): Promise<any> {
    const REPL = new repl(
      {
        name: 'lava.repl',
        includeNative: true,
        includeBuiltinLibs: true,
        indentation: 4,
      },
      {
        lava: this.client,
        channel: _.channel,
        guild: _.guild,
        msg: _,
        db: this.client.db,
      }
    );

    // from https://dankmemer.lol/source and modified.
    const run = async (retry: boolean) => {
      if (!retry) await _.channel.send('Started a REPL session');
      const msg: Message = await this._collect(_);
      if (msg.content.toLowerCase().includes('.exit') || !msg.content) {
        return _.channel.send('Exiting REPL...');
      }

      (REPL as any).ctx.msg = msg; // ts smfh
      let b: any;
      let a: any;
      let r: any;
      let t: string; // BABAHAHAHH

      try {
        b = process.hrtime();
        r = await REPL.execute(msg.content);
        a = process.hrtime(b);
        a = a[0]
          ? `${(a[0] + a[1] / 1e9).toLocaleString()}s`
          : `${(a[1] / 1e3).toLocaleString()}μs`;
      } catch (e) {
        const error: Error = e.stack || e;
        r = typeof error === 'string' ? error : inspect(error, { depth: 1 });
      }

      t = typeof r;
      if (t !== 'string') {
        r = inspect(r, {
          depth: +!(inspect(r, { depth: 1, showHidden: true }).length > 1900),
          showHidden: true,
        });
      }

      r = r.replace(new RegExp(this.client.token, 'gi'), 'yes');
      if (r.length > 1900) {
        r = r.slice(0, 1900).split('\n');
        r.pop();
        r = r.join('\n') + '\n\n...';
      }

      await msg.channel.send({
        embed: {
          color: 'ORANGE',
          description: this.codeBlock('js', r),
          fields: [
            { name: 'Type', value: this.codeBlock('js', t) },
            { name: 'Latency', value: this.codeBlock('js', a) },
          ],
        },
      });

      await run(true);
    };

    await run(false);
  }
}
