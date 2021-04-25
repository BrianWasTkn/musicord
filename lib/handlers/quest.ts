import { QuestOptions, QuestReward, Target } from 'lib/interface/handlers/quest';
import { Collection } from 'discord.js';
import { Lava } from '../Lava';
import {
  AkairoHandlerOptions,
  AkairoHandler,
  AkairoModule,
  Category,
} from 'discord-akairo';

export class Quest extends AkairoModule {
  handler: QuestHandler<Quest>;

  rawDiff: QuestOptions['diff'];
  rewards: QuestReward;
  target: Target;
  emoji: string;
  diff: number;
  info: string;
  name: string;

  constructor(id: string, opt: QuestOptions) {
    const { category } = opt;
    super(id, { category });

    const priority = {
      Extreme: 1,
      Difficult: 2,
      Hard: 3,
      Medium: 4,
      Easy: 5,
    };

    const emojis = {
      Extreme: ':fire:',
      Difficult: ':dragon:',
      Hard: ':bomb:',
      Medium: ':leaves:',
      Easy: ':snowflake:'
    };

    this.rawDiff = opt.diff;
    this.rewards = opt.rewards;
    this.target = opt.target;
    this.diff = priority[opt.diff];
    this.emoji = emojis[opt.diff];
    this.info = opt.info;
    this.name = opt.name;
  }

  check(): any | Promise<any> {}
}

export class QuestHandler<QuestModule extends Quest> extends AkairoHandler {
  categories: Collection<string, Category<string, QuestModule>>;
  modules: Collection<string, QuestModule>;
  client: Lava;

  constructor(
    client: Lava,
    {
      directory = './src/quests',
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
    return (
      this.modules.get(query) ||
      this.modules.find((m) => {
        return m.name.toLowerCase().includes(query.toLowerCase());
      })
    );
  }
}
