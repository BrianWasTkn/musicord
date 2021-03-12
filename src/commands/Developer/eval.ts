import { Message, MessageOptions } from 'discord.js';
import { inspect } from 'util';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Dev extends Command {
  constructor() {
    super('eval', {
      aliases: ['eval', 'ev'],
      description: 'Evaluate custom code for you stupid dev',
      category: 'Dev',
      ownerOnly: true,
      args: [
        {
          id: 'code',
          match: 'content',
        },
      ],
    });
  }

  private inspect(obj: any, options: object): any {
    return inspect(obj, options);
  }

  public async exec(_: Message, args: any): Promise<string | MessageOptions> {
    const { channel } = _;
    const code: string = args.code;
    const asynchronous: boolean =
      code.includes('await') || code.includes('return');
    let before: number,
      evaled: string,
      evalTime: number,
      type: string,
      token: RegExp;

    before = Date.now();
    try {
      evaled = await eval(asynchronous ? `(async()=>{${code}})()` : code);
    } catch (error) {
      evaled = error.message;
    }
    evalTime = Date.now() - before;
    type = typeof evaled;

    if (type !== 'string') {
      evaled = this.inspect(evaled, { depth: 0 });
    }

    token = new RegExp(this.client.token, 'gi');
    evaled = evaled.replace(token, 'N0.T0K4N.4Y0U');
    return {
      embed: {
        color: 'ORANGE',
        description: this.codeBlock(
          'js',
          evaled.length > 1900 ? 'Too many to print' : evaled
        ),
        fields: [
          { name: 'Type', value: this.codeBlock('js', type) },
          { name: 'Latency', value: this.codeBlock('js', `${evalTime}ms`) },
        ],
      },
    };
  }
}
