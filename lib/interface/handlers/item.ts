import { AkairoModuleOptions } from 'discord-akairo';

export interface InventorySlot {
  active?: boolean;
  expire?: number;
  amount: number;
  id: string;
}

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
