import { LotteryHandler, Listener } from 'lib/objects';
import { TextChannel, GuildMember } from 'discord.js';

export default class LottoListener extends Listener<LotteryHandler> {
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
    _: number
  ): Promise<void> {
    const chan = (await this.client.channels.fetch(
      handler.channel
    )) as TextChannel;
    await chan.send(
      `**${
        winner.user.tag
      }** (${winner.user.toString()}) walked away with **${coins.toLocaleString()} (${raw.toLocaleString()} original)** coins :fire:`
    );
  }
}
