import { AkairoModuleOptions } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

export type ItemReturn = string | IItemReturn;

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
  embed?: MessageEmbed;
  reply?: boolean;
}