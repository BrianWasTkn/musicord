import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { AkairoModuleOptions } from 'discord-akairo';

export type ItemReturn = string 
  | IItemReturn;

export type ItemInfo = string 
  | { short: string; long: string; }

export interface ItemOptions extends AkairoModuleOptions {
  emoji: string;
  name: string;
  category: string;
  info: string;
  cost: number;
  buyable: boolean;
  sellable: boolean;
  usable: boolean;
}

export interface InventorySlot {
  active?: boolean;
  expire?: number;
  amount?: number;
  multi?: number;
  id?: string;
  cd?: number;
}

export interface IItemReturn {
  content?: string;
  embed?: MessageEmbed | MessageEmbedOptions;
  reply?: boolean;
}