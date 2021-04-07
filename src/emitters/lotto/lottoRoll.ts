import { LotteryHandler, Listener } from '@lib/handlers';
import { TextChannel, GuildMember } from 'discord.js';

export default class LottoListener extends Listener {
  constructor() {
    super('lottoRoll', {
      emitter: 'lottery',
      event: 'roll',
    });
  }

  async exec(
  	handler: LotteryHandler, 
  	winner: GuildMember,
  	coins: number,
  	raw: number,
  	multi: number
  ): Promise<void> {
  	const guild = this.client.guilds.cache.get(handler.guild);
  	const chan = guild.channels.cache.get(handler.channel) as TextChannel;
  	const req = guild.roles.cache.get(handler.requirement);

    await chan.send(`${winner.user.tag} (${winner.user.toString()}) walked away with **${coins.toLocaleString()}** coins :fire:`);
  }
}