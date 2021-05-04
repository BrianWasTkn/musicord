import { CollectorFilter, AwaitMessagesOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Command } from 'lib/objects';
import { inspect } from 'util';
import repl from 'programmatic-repl';

export default class Dev extends Command {
	constructor() {
		super('repl', {
			name: 'Repl',
			aliases: ['repl'],
			description: 'Start a REPL session',
			category: 'Dev',
			ownerOnly: true,
		});
	}

	private async _collect(ctx: Context): Promise<Context> {
		const collected = await ctx.awaitMessage(ctx.author.id, 6e4);
		return [...collected.values()][0] as Context;
	}

	async exec(ctx: Context): Promise<any> {
		const REPL = new repl(
			{
				name: 'lava.repl',
				includeNative: true,
				includeBuiltinLibs: true,
				indentation: 4,
			},
			{
				lava: this.client,
				channel: ctx.channel,
				guild: ctx.guild,
				msg: ctx, ctx,
				db: this.client.db,
			}
		);

		// from https://dankmemer.lol/source and modified.
		const run = async (retry: boolean) => {
			if (!retry) await ctx.send({ content: 'Started a REPL session' });
			const msg: Context = await this._collect(ctx);
			if (msg.content.toLowerCase().includes('.exit') || !msg.content) {
				return ctx.send({ content: 'Exiting REPL...' });
			}

			(REPL as any).ctx.msg = msg; // ts smfh
			(REPL as any).ctx.ctx = msg; // ts smfh
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

			r = r.replace(new RegExp(ctx.client.token, 'gi'), 'yes');
			if (r.length > 1900) {
				r = r.slice(0, 1900).split('\n');
				r.pop();
				r = r.join('\n') + '\n\n...';
			}

			const { codeBlock } = ctx.client.util;
			await msg.send({
				embed: {
					color: 'ORANGE',
					description: codeBlock('js', r),
					fields: [
						{ name: 'Type', value: codeBlock('js', t) },
						{ name: 'Latency', value: codeBlock('js', a) },
					],
					footer: { text: '.exit to exit repl' }
				},
			});

			await run(true);
		};

		await run(false);
	}
}
