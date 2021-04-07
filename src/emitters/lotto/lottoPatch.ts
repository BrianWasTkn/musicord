import { LotteryHandler, Listener } from '@lib/handlers';
import { TextChannel } from 'discord.js';

export default class LottoListener extends Listener {
  constructor() {
    super('lottoPatch', {
      emitter: 'lottery',
      event: 'patch',
    });
  }

  async exec(handler: LotteryHandler): Promise<void> {
  	const guild = await this.client.guilds.fetch(handler.guild, true, true);
  	const chan = await this.client.channels.fetch(handler.channel) as TextChannel;
  	const req = await guild.roles.fetch(handler.requirement);

  	return this.client.util.console({
  		klass: 'Lottery', type: 'def',
  		msg: `Host Guild: ${guild.name}\nChannel: ${chan.name}\nRole: ${req.name}`
  	});
  }
}