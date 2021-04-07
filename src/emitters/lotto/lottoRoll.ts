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
  	const guild = await this.client.guilds.fetch(handler.guild);
  	const chan = await this.client.channels.fetch(handler.channel) as TextChannel;
  	const req = await guild.roles.fetch(handler.requirement);

    coins = (Math.round(coins / 1e3) * 1e3) + 1;
    await chan.send(`**${winner.user.tag}** (${winner.user.toString()}) walked away with **${coins.toLocaleString()} (${raw.toLocaleString()} original)** coins :fire:`);
  }
}