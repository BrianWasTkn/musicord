import { LotteryHandler, Listener } from '@lib/handlers';
import { TextChannel } from 'discord.js';

export default class LottoListener extends Listener {
  constructor() {
    super('lottoTick', {
      emitter: 'lottery',
      event: 'tick',
    });
  }

  async exec(
  	handler: LotteryHandler, 
  	minLeft: string, 
  	remain: number
  ) {
  	const chan = await this.client.channels.fetch('789692296094285825') as TextChannel;
  	await chan.send(`**Tick:** ${minLeft}\n**Mins Left:** ${remain}`);
  }
}