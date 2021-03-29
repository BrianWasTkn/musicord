import type { QuestOptions, QuestReward } from '@lib/interface/handlers/quest';
import type { CurrencyProfile } from '@lib/interface/mongo/currency';
import type { MessagePlus } from '@lib/extensions/message';
import type { Collection } from 'discord.js';
import type { Document } from 'mongoose';
import type { Lava } from '../Lava';
import {
  AkairoHandlerOptions,
  AkairoModuleOptions,
  AkairoHandler,
  AkairoModule,
  Category,
} from 'discord-akairo';

export class Quest extends AkairoModule {
  handler: QuestHandler<Quest>;

  cRew: QuestReward['coins'];
  iRew: QuestReward['items'];
  diff: QuestOptions['diff'];
  info: string;
  name: string

  constructor(
		id: string, 
		opt: QuestOptions, 
		cRew: QuestReward['coins'],
		iRew: QuestReward['items']
  ) {
    const { category } = opt;
    super(id, { category });

    this.diff = opt.diff;
    this.info = opt.info;
    this.name = opt.name;
    this.cRew = cRew;
    this.iRew = iRew;
  }

  exec(msg: MessagePlus): any | Promise<any> {}
}

export class QuestHandler<QuestModule extends Quest> extends AkairoHandler {
  categories: Collection<string, Category<string, QuestModule>>;
  modules: Collection<string, QuestModule>;
  client: Lava;

  constructor(
    client: Lava,
    {
      directory = './src/items',
      extensions = ['.js', '.ts'],
      classToHandle = Quest,
      automateCategories = true,
    }: AkairoHandlerOptions
  ) {
    super(client, {
      directory,
      classToHandle,
      automateCategories,
    });
  }

  findQuest(query: string): QuestModule {
  	return this.modules.get(query)
		|| this.modules.find(m => {
			return m.name
				.toLowerCase()
				.includes(query.toLowerCase());
		});
  }
}
