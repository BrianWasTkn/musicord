import { AbstractModuleOptions, AbstractModule } from '..';
import { MessageOptions } from 'discord.js';
import { ItemHandler } from '.';
import { Context } from '../..'; 

export interface ItemDescription {
	short: string;
	long: string;
}

export interface ItemUpgrade {
	price: number;
	emoji: string;
	level: number;
	name: string;
}

export interface ItemInfo {
	buy: number;
	sell: number;
	emoji: string;
	name: string;
}

export interface ItemConfig {
	showInInventory: boolean;
	showInShop: boolean;
	sellable: boolean;
	buyable: boolean;
	retired: boolean;
	premium: boolean;
	usable: boolean;
}

export interface ItemOptions extends AbstractModuleOptions {
	description: Partial<ItemDescription>;
	upgrades: Partial<ItemUpgrade>[];
	config: Partial<ItemConfig>;
	info: Partial<ItemInfo>;
}

export class Item extends AbstractModule {
	public description: PartialUnion<ItemDescription>;
	public upgrades: PartialUnion<ItemUpgrade>[];
	public config: PartialUnion<ItemConfig>;
	public info: Partial<ItemInfo>;
	public handler: ItemHandler;
	public constructor(id: string, options: Partial<ItemOptions>) {
		super(id, { name: options.info.name, category: options.category });
		/**
		 * Description for this item.
		*/
		this.description = this._assign(options.description, {
			short: 'An unknown item.',
			long: 'No description.',
		});

		/**
		 * Configuration of this item.
		*/
		this.config = this._assign(options.config, {
			showInInventory: true,
			showInShop: true,
			sellable: true,
			buyable: true,
			retired: false,
			premium: false,
			usable: true
		});

		/**
		 * What you see most in the shop.
		*/
		this.info = this._assign(options.info, {
			emoji: ':thinking:',
			name: 'Unknown Item',
			sell: 0,
			buy: 1,
		});

		/**
		 * The upgrades for this item.
		*/
		this.upgrades = options.upgrades.map(
			(up: Partial<ItemUpgrade>, i: number) => this._assign(up, {
				emoji: this.info.emoji,
				price: this.info.buy,
				level: i + 1,
				name: this.name,
			})
		);
	}

	private _assign<A>(o1: PartialUnion<A>, o2: A): A {
		return Object.assign(o2, o1);
	}

	/**
	 * Main method to use items.
	*/
	public use(context: Context, times = 1): PromiseUnion<MessageOptions> {
		return { reply: { messageReference: context.id, failIfNotExists: false }, embed: {
			description: 'This item perhaps, is in a work in progress :)',
			title: `${this.info.emoji} ${this.name}`, color: 0xfafafa,
		}};
	}
}