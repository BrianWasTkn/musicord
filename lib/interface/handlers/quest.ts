import { AkairoModuleOptions } from 'discord-akairo';
import { Item } from '@lib/handlers/item'

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Difficult' | 'Extreme';

export interface QuestOptions extends AkairoModuleOptions {
  diff: QuestDifficulty;
  info: string;
  name: string;
}

export interface QuestReward {
	coins: number;
	item: [number, Item['id']];
}
