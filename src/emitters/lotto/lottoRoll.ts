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

  	await chan.send({ 
  		content: winner.user.toString(), 
  		embed: {
	  		title: 'Lottery Winner',
	  		color: 'GOLD',
	  		description: `**${winner.user.tag}** won **${coins.toLocaleString()} (${raw.toLocaleString()} original) coins** from a **\`${multi}%\`** multiplier.`,
	  		thumbnail: { url: winner.user.avatarURL({ dynamic: true }) },
	  		footer: { 
	  			text: `${this.client.user.username} — Draws Occur Hourly.`,
	  			iconURL: this.client.user.avatarURL()
	  		}
	  	}
	  });
  }
}