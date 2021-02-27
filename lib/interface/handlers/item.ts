import { AkairoModuleOptions } from 'discord-akairo';

export interface InventorySlot {
	expire?: number;
	active?: boolean;
	amount: number;
	id: string;
} 

export interface ItemOptions extends AkairoModuleOptions {
	emoji: string;
  category: string;
  info: string;
  cost: number;
  buyable: boolean;
  sellable: boolean;
  usable: boolean;
}
