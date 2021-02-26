import { AkairoModuleOptions } from 'discord-akairo'

export interface ItemOptions extends AkairoModuleOptions {
	category: string;
	info: string;
	cost: number;
	buyable: boolean;
	sellable: boolean;
	usable: boolean;
}