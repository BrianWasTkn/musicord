import { AkairoModuleOptions } from 'discord-akairo';

export interface InventorySlot {
  expire?: number;
  amount: number;
  end?: boolean;
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
