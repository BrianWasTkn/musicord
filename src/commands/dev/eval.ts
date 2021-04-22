import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import { inspect } from 'util';
import { Embed } from 'lib/utility/embed';

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

  public async exec(
    ctx: Context<{ code: string }>
  ): Promise<string | MessageOptions> {
    const { codeBlock } = ctx.client.util;
    const { code } = ctx.args;
    const isAsync: boolean = code.includes('await') || code.includes('return');
    let before: number,
      evaled: string,
      evalTime: number,
      type: string,
      token: RegExp;

    before = Date.now();
    try {
      evaled = await eval(isAsync ? `(async()=>{${code}})()` : code);
    } catch (error) {
      evaled = error.message;
    }
    evalTime = Date.now() - before;
    type = typeof evaled;

    if (type !== 'string') {
      evaled = this.inspect(evaled, { depth: 0 });
    }

    token = new RegExp(ctx.client.token, 'gi');
    evaled = evaled.replace(token, 'N0.T0K4N.4Y0U');
    return {
      embed: {
        color: 'ORANGE',
        description: codeBlock(
          'js',
          evaled.length > 1900 ? 'Too many to print' : evaled
        ),
        fields: [
          { name: 'Type', value: codeBlock('js', type) },
          { name: 'Latency', value: codeBlock('js', `${evalTime}ms`) },
        ],
      },
    };
  }
}
