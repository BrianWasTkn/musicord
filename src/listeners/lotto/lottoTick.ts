import { LotteryHandler, Listener } from 'lib/handlers';
import { TextChannel } from 'discord.js';

export default class LottoListener extends Listener<LotteryHandler> {
  constructor() {
    super('lottoTick', {
      emitter: 'lottery',
      event: 'tick',
    });
  }

  async exec(_: LotteryHandler, minLeft: string, remain: number) {
    return console.log({ minLeft, remain });
  }
}
