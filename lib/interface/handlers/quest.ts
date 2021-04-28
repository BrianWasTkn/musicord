import { AkairoModuleOptions } from 'discord-akairo';
import { Item } from 'lib/handlers/item';

export type QuestDifficulty =
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Difficult'
  | 'Extreme';

/**
 * In a "questGambleJackpot" listener,
 * params: [won: number];
*/
/**
 * In a "questGambleWin" listener,
 * params: [won: number];
*/
/**
 * In a "questItemBuy" listener,
 * params: [tem: Item, amount: number];
 * 
*/
// or just setup a listener per quest module lmao, easier.
export type Target = [number, string | SpecificCommand, TargetMethod];

export type TargetMethod = 
  | 'marrySomeone'
  | 'expandVault'
  | 'reachVault'
  | 'sellItem'
  | 'buyItem'
  | 'shareCoins'
  | 'shareItems'
  | 'jackpots'
  | 'loses'
  | 'wins'
  | string;

export type SpecificCommand = 
  // [Command['id'], Context['args']] 
  // args meaning the item they used or amount they gambled.
  [string, string];

export interface QuestOptions extends AkairoModuleOptions {
  rewards: QuestReward;
  target: Target;
  diff: QuestDifficulty;
  info: string;
  name: string;
}

export interface QuestReward {
  coins: number;
  item: [number, Item['id']];
}
