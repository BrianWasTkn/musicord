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
  	const guild = this.client.guilds.cache.get(handler.guild);
  	const chan = guild.channels.cache.get('789692296094285825') as TextChannel;
  	const req = guild.roles.cache.get(handler.requirement);

  	await chan.send(`**Tick:** ${minLeft}\n**Mins Left:** ${remain}`);
  }
}