import { Listener } from '@lib/handlers';
import { Message } from 'discord.js';
import { Spawn } from '@lib/handlers/spawn';

async function handleDonation(this: ClientListener, msg: Message) {
	try {
		const dm = await msg.author.createDM();
		return await dm.send('Wow that\'s hot');
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
