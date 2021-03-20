import { Message, CollectorFilter, Collection } from 'discord.js';
import { Listener } from '@lib/handlers';
import { Spawn } from '@lib/handlers/spawn';

async function handleDonation(this: ClientListener, msg: Message) {
	try {
		const dm = await msg.author.createDM();
		const res = new Collection<string, string>();
		try {

			const questions = {
				'Giveaway': 'What do you wanna giveaway?',
				'Duration': 'What is the duration for this giveaway?'
			}

			let qArr: string[] = Object.keys(questions);
			let index: number = 0;
			async function collect(question: string) {
				const filter: CollectorFilter = (m: Message) => m.author.id === msg.author.id;
				await dm.send(question);
				const col = await dm.awaitMessages(filter, { max: 1, time: 30000 });
				const m = col.first();
				res.set(qArr[index], m.content);
				const q = questions[qArr[index++]];
				return !q ? true : await collect(q);
			}

			const col = await collect(questions[qArr[index]]);
			let results: string[] = [];
			for (const [type, response] of res) {
				results.push(`**${type}:** ${response}`);
			}

			return await dm.send(results.join('\n'));
		} catch {
			await dm.send('Something wrong occured :c')
		}
	} catch {
		const m = await msg.channel.send('Please open your DMs.');
		return await m.delete({ timeout: 1e4 });
	}
}

const haha = { 
	1: handleDonation 
};

export default class ClientListener extends Listener {
  constructor() {
    super('donation', {
      emitter: 'client',
      event: 'message',
    });
  }

  public async exec(msg: Message): Promise<void | Message> {
  	if (msg.channel.id !== '818667160918425630') return;
    if (!this.client.isOwner(msg.author.id)) await msg.delete();
    const query = haha[Number(msg.content)];
    if (!query) return;

    return query.call(this, msg);
  }
}
