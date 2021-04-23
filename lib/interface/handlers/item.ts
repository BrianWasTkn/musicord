import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { AkairoModuleOptions } from 'discord-akairo';

export type ItemReturn = string | IItemReturn;

export type ItemCheck = ArrayUnion<('time' | 'activeState' | 'presence')>;

export interface ItemInfo {
  short: string;
  long: string;
}

export interface ItemOptions extends AkairoModuleOptions {
  emoji: string;
  name: string;
  category: string;
  info: ItemInfo;
  cost: number;
  checks: ItemCheck;
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

export interface ItemSaleData {
  discount: number;
  lastSale: number;
  id: string;
}
