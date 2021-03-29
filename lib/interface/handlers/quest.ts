import { AkairoModuleOptions } from 'discord-akairo';
import { Item } from '@lib/handlers/item'

export type QuestDifficulty = 'Easy' | 'Medium' | 'Difficult' | 'Expert';

export interface QuestOptions extends AkairoModuleOptions {
  diff: QuestDifficulty;
  info: string;
  name: string;
}

export interface QuestReward {
	coins: {
		amount: number;
		multi?: number;
	};
	items: {
		[k: string]: number
	};
}
