import type { QuestOptions, QuestReward } from '@lib/interface/handlers/quest';
import type { MessagePlus } from '@lib/extensions/message';
import type { LottoConfig } from '@config/lottery';
import type { Collection } from 'discord.js';
import type { Lava } from '../Lava';
import {
  AkairoHandlerOptions,
  AkairoModuleOptions,
  AkairoHandler,
  AkairoModule,
  Category,
} from 'discord-akairo';

export class Lottery extends AkairoModule {
  handler: LotteryHandler<Lottery>;

  constructor(id: string, opt: AkairoModuleOptions) {
    const { category } = opt;
    super(id, { category });
  }
}

export class LotteryHandler<LotteryModule extends Lottery> extends AkairoHandler {
  categories: Collection<string, Category<string, LotteryModule>>;
  modules: Collection<string, LotteryModule>;
  client: Lava;

  requirementID: string;
  channnelID: string;
  interval: number;
  rewards: LottoConfig['rewards'];
  guildID: string;

  constructor(
    client: Lava,
    {
      directory = './src/items',
      extensions = ['.js', '.ts'],
      classToHandle = Lottery,
      automateCategories = true,
    }: AkairoHandlerOptions
  ) {
    super(client, {
      directory,
      classToHandle,
      automateCategories,
    });

    this.prepare();
  }

  prepare() {
  	this.client.once('ready', async () => {
  		for (const [k, v] of Object.entries(this.client.config.lottery)) {
  			this[k] = v;
  		}
  	});
  }
}
